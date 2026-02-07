import azure.functions as func
import json
import logging
from datetime import datetime
import uuid
from models import get_db, Receipt, Transaction, PaymentMethod
from utils import get_current_user

def number_to_words(n):
    """Convert number to words (Indian numbering system)"""
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    
    def convert_below_thousand(num):
        if num == 0:
            return ""
        elif num < 10:
            return ones[num]
        elif num < 20:
            return teens[num - 10]
        elif num < 100:
            return tens[num // 10] + (" " + ones[num % 10] if num % 10 != 0 else "")
        else:
            return ones[num // 100] + " Hundred" + (" " + convert_below_thousand(num % 100) if num % 100 != 0 else "")
    
    if n == 0:
        return "Zero Rupees Only"
    
    # Split into crores, lakhs, thousands, hundreds
    crore = n // 10000000
    n %= 10000000
    lakh = n // 100000
    n %= 100000
    thousand = n // 1000
    n %= 1000
    
    result = []
    if crore:
        result.append(convert_below_thousand(crore) + " Crore")
    if lakh:
        result.append(convert_below_thousand(lakh) + " Lakh")
    if thousand:
        result.append(convert_below_thousand(thousand) + " Thousand")
    if n:
        result.append(convert_below_thousand(n))
    
    return " ".join(result) + " Rupees Only"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Receipts API triggered')
    
    # CORS headers
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    }
    
    # Handle CORS preflight
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=headers)
    
    try:
        # Authentication required for all methods
        authorization = req.headers.get("Authorization", "")
        user = get_current_user(authorization)
        
        if not user:
            return func.HttpResponse(
                json.dumps({"error": "Unauthorized"}),
                status_code=401,
                headers=headers
            )
        
        db = next(get_db())
        
        try:
            # GET - List all receipts or get one by ID
            if req.method == "GET":
                receipt_id = req.route_params.get("id")
                
                if receipt_id:
                    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
                    if not receipt:
                        return func.HttpResponse(
                            json.dumps({"error": "Receipt not found"}),
                            status_code=404,
                            headers=headers
                        )
                    
                    result = {
                        "id": receipt.id,
                        "receipt_number": receipt.receipt_number,
                        "transaction_id": receipt.transaction_id,
                        "customer_name": receipt.customer_name,
                        "customer_phone": receipt.customer_phone,
                        "customer_email": receipt.customer_email,
                        "customer_address": receipt.customer_address,
                        "amount": receipt.amount,
                        "amount_in_words": receipt.amount_in_words,
                        "description": receipt.description,
                        "payment_method": receipt.payment_method.value if receipt.payment_method else None,
                        "property_details": receipt.property_details,
                        "issue_date": receipt.issue_date.isoformat(),
                        "notes": receipt.notes,
                        "created_at": receipt.created_at.isoformat()
                    }
                else:
                    receipts = db.query(Receipt).order_by(Receipt.issue_date.desc()).all()
                    result = [{
                        "id": r.id,
                        "receipt_number": r.receipt_number,
                        "customer_name": r.customer_name,
                        "amount": r.amount,
                        "description": r.description,
                        "issue_date": r.issue_date.isoformat(),
                        "created_at": r.created_at.isoformat()
                    } for r in receipts]
                
                return func.HttpResponse(
                    json.dumps(result),
                    status_code=200,
                    headers=headers
                )
        
            # POST - Create new receipt
            elif req.method == "POST":
                try:
                    data = req.get_json()
                except ValueError:
                    return func.HttpResponse(
                        json.dumps({"error": "Invalid JSON"}),
                        status_code=400,
                        headers=headers
                    )
                
                # Validate required fields
                required_fields = ["customer_name", "amount", "description", "issue_date"]
                if not all(field in data for field in required_fields):
                    return func.HttpResponse(
                        json.dumps({"error": "Missing required fields"}),
                        status_code=400,
                        headers=headers
                    )
                
                # Generate receipt number
                year = datetime.now().year
                month = datetime.now().month
                count = db.query(Receipt).filter(
                    Receipt.receipt_number.like(f"RCP/{year}/{month:02d}/%")
                ).count()
                receipt_number = f"RCP/{year}/{month:02d}/{count + 1:04d}"
                
                # Convert amount to words
                amount = float(data["amount"])
                amount_in_words = number_to_words(int(amount))
                
                # Create receipt
                receipt = Receipt(
                    id=str(uuid.uuid4()),
                    receipt_number=receipt_number,
                    transaction_id=data.get("transaction_id"),
                    customer_name=data["customer_name"],
                    customer_phone=data.get("customer_phone"),
                    customer_email=data.get("customer_email"),
                    customer_address=data.get("customer_address"),
                    amount=amount,
                    amount_in_words=amount_in_words,
                    description=data["description"],
                    payment_method=PaymentMethod(data["payment_method"]) if data.get("payment_method") else None,
                    property_details=data.get("property_details"),
                    issue_date=datetime.fromisoformat(data["issue_date"]),
                    notes=data.get("notes"),
                    created_by=user.get("sub")
                )
                
                db.add(receipt)
                db.commit()
                db.refresh(receipt)
                
                return func.HttpResponse(
                    json.dumps({
                        "id": receipt.id,
                        "receipt_number": receipt.receipt_number,
                        "amount": receipt.amount,
                        "amount_in_words": receipt.amount_in_words,
                        "message": "Receipt created successfully"
                    }),
                    status_code=201,
                    headers=headers
                )
        
            # PUT - Update receipt
            elif req.method == "PUT":
                receipt_id = req.route_params.get("id")
                if not receipt_id:
                    return func.HttpResponse(
                        json.dumps({"error": "Receipt ID required"}),
                        status_code=400,
                        headers=headers
                    )
                
                receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
                if not receipt:
                    return func.HttpResponse(
                        json.dumps({"error": "Receipt not found"}),
                        status_code=404,
                        headers=headers
                    )
                
                try:
                    data = req.get_json()
                except ValueError:
                    return func.HttpResponse(
                        json.dumps({"error": "Invalid JSON"}),
                        status_code=400,
                        headers=headers
                    )
                
                # Update fields
                if "customer_name" in data:
                    receipt.customer_name = data["customer_name"]
                if "customer_phone" in data:
                    receipt.customer_phone = data["customer_phone"]
                if "customer_email" in data:
                    receipt.customer_email = data["customer_email"]
                if "customer_address" in data:
                    receipt.customer_address = data["customer_address"]
                if "amount" in data:
                    receipt.amount = float(data["amount"])
                    receipt.amount_in_words = number_to_words(int(receipt.amount))
                if "description" in data:
                    receipt.description = data["description"]
                if "payment_method" in data:
                    receipt.payment_method = PaymentMethod(data["payment_method"]) if data["payment_method"] else None
                if "property_details" in data:
                    receipt.property_details = data["property_details"]
                if "issue_date" in data:
                    receipt.issue_date = datetime.fromisoformat(data["issue_date"])
                if "notes" in data:
                    receipt.notes = data["notes"]
                
                db.commit()
                db.refresh(receipt)
                
                return func.HttpResponse(
                    json.dumps({"message": "Receipt updated successfully"}),
                    status_code=200,
                    headers=headers
                )
        
            # DELETE - Delete receipt
            elif req.method == "DELETE":
                receipt_id = req.route_params.get("id")
                if not receipt_id:
                    return func.HttpResponse(
                        json.dumps({"error": "Receipt ID required"}),
                        status_code=400,
                        headers=headers
                    )
                
                receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
                if not receipt:
                    return func.HttpResponse(
                        json.dumps({"error": "Receipt not found"}),
                        status_code=404,
                        headers=headers
                    )
                
                db.delete(receipt)
                db.commit()
                
                return func.HttpResponse(
                    json.dumps({"message": "Receipt deleted successfully"}),
                    status_code=200,
                    headers=headers
                )
            
            else:
                return func.HttpResponse(
                    json.dumps({"error": "Method not allowed"}),
                    status_code=405,
                    headers=headers
                )
        
        except Exception as e:
            logging.error(f"Error in receipts endpoint: {str(e)}")
            db.rollback()
            return func.HttpResponse(
                json.dumps({"error": str(e)}),
                status_code=500,
                headers=headers
            )
        finally:
            db.close()
    
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            headers=headers
        )
