import azure.functions as func
import json
import logging
from datetime import datetime
import uuid
from models import get_db, Transaction, TransactionType, TransactionCategory, PaymentMethod
from utils import get_current_user

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Transactions API triggered')
    
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
            # GET - List all transactions with filters
            if req.method == "GET":
            # Query parameters for filtering
            transaction_type = req.params.get("type")
            category = req.params.get("category")
            start_date = req.params.get("start_date")
            end_date = req.params.get("end_date")
            
            query = db.query(Transaction)
            
            if transaction_type:
                query = query.filter(Transaction.type == transaction_type)
            if category:
                query = query.filter(Transaction.category == category)
            if start_date:
                query = query.filter(Transaction.transaction_date >= datetime.fromisoformat(start_date))
            if end_date:
                query = query.filter(Transaction.transaction_date <= datetime.fromisoformat(end_date))
            
            transactions = query.order_by(Transaction.transaction_date.desc()).all()
            
            result = [{
                "id": t.id,
                "type": t.type.value,
                "category": t.category.value,
                "amount": t.amount,
                "description": t.description,
                "payment_method": t.payment_method.value if t.payment_method else None,
                "reference_number": t.reference_number,
                "property_id": t.property_id,
                "customer_name": t.customer_name,
                "customer_phone": t.customer_phone,
                "customer_email": t.customer_email,
                "transaction_date": t.transaction_date.isoformat(),
                "notes": t.notes,
                "created_at": t.created_at.isoformat(),
                "updated_at": t.updated_at.isoformat()
            } for t in transactions]
            
            return func.HttpResponse(
                json.dumps(result),
                status_code=200,
                headers=headers
            )
        
        # POST - Create new transaction
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
            required_fields = ["type", "category", "amount", "transaction_date"]
            if not all(field in data for field in required_fields):
                return func.HttpResponse(
                    json.dumps({"error": "Missing required fields"}),
                    status_code=400,
                    headers=headers
                )
            
            # Create transaction
            transaction = Transaction(
                id=str(uuid.uuid4()),
                type=TransactionType(data["type"]),
                category=TransactionCategory(data["category"]),
                amount=float(data["amount"]),
                description=data.get("description"),
                payment_method=PaymentMethod(data["payment_method"]) if data.get("payment_method") else None,
                reference_number=data.get("reference_number"),
                property_id=data.get("property_id"),
                customer_name=data.get("customer_name"),
                customer_phone=data.get("customer_phone"),
                customer_email=data.get("customer_email"),
                transaction_date=datetime.fromisoformat(data["transaction_date"]),
                notes=data.get("notes"),
                created_by=user.id
            )
            
            db.add(transaction)
            db.commit()
            db.refresh(transaction)
            
            return func.HttpResponse(
                json.dumps({
                    "id": transaction.id,
                    "type": transaction.type.value,
                    "category": transaction.category.value,
                    "amount": transaction.amount,
                    "transaction_date": transaction.transaction_date.isoformat(),
                    "message": "Transaction created successfully"
                }),
                status_code=201,
                headers=headers
            )
        
        # PUT - Update transaction
        elif req.method == "PUT":
            transaction_id = req.route_params.get("id")
            if not transaction_id:
                return func.HttpResponse(
                    json.dumps({"error": "Transaction ID required"}),
                    status_code=400,
                    headers=headers
                )
            
            transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
            if not transaction:
                return func.HttpResponse(
                    json.dumps({"error": "Transaction not found"}),
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
            if "type" in data:
                transaction.type = TransactionType(data["type"])
            if "category" in data:
                transaction.category = TransactionCategory(data["category"])
            if "amount" in data:
                transaction.amount = float(data["amount"])
            if "description" in data:
                transaction.description = data["description"]
            if "payment_method" in data:
                transaction.payment_method = PaymentMethod(data["payment_method"]) if data["payment_method"] else None
            if "reference_number" in data:
                transaction.reference_number = data["reference_number"]
            if "property_id" in data:
                transaction.property_id = data["property_id"]
            if "customer_name" in data:
                transaction.customer_name = data["customer_name"]
            if "customer_phone" in data:
                transaction.customer_phone = data["customer_phone"]
            if "customer_email" in data:
                transaction.customer_email = data["customer_email"]
            if "transaction_date" in data:
                transaction.transaction_date = datetime.fromisoformat(data["transaction_date"])
            if "notes" in data:
                transaction.notes = data["notes"]
            
            db.commit()
            db.refresh(transaction)
            
            return func.HttpResponse(
                json.dumps({"message": "Transaction updated successfully"}),
                status_code=200,
                headers=headers
            )
        
        # DELETE - Delete transaction
        elif req.method == "DELETE":
            transaction_id = req.route_params.get("id")
            if not transaction_id:
                return func.HttpResponse(
                    json.dumps({"error": "Transaction ID required"}),
                    status_code=400,
                    headers=headers
                )
            
            transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
            if not transaction:
                return func.HttpResponse(
                    json.dumps({"error": "Transaction not found"}),
                    status_code=404,
                    headers=headers
                )
            
            db.delete(transaction)
            db.commit()
            
            return func.HttpResponse(
                json.dumps({"message": "Transaction deleted successfully"}),
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
            logging.error(f"Error in transactions endpoint: {str(e)}")
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
