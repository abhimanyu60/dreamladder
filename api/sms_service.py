"""
SMS Service Module for sending transactional SMS via Fast2SMS
"""
import os
import logging
import requests
from typing import List, Optional, Dict, Any

logger = logging.getLogger(__name__)

def send_sms(phone_numbers: List[str], message: str) -> Dict[str, Any]:
    """
    Send SMS to multiple phone numbers using Fast2SMS
    
    Args:
        phone_numbers: List of 10-digit phone numbers (without +91)
        message: SMS message content (max 160 chars recommended)
    
    Returns:
        dict: Response with status and details
    """
    sms_enabled = os.environ.get('SMS_ENABLED', 'false').lower() == 'true'
    
    if not sms_enabled:
        logger.info("SMS disabled in configuration")
        return {
            'success': False,
            'message': 'SMS feature is disabled',
            'skipped': True
        }
    
    api_key = os.environ.get('SMS_API_KEY')
    if not api_key:
        logger.error("SMS_API_KEY not configured")
        return {
            'success': False,
            'message': 'SMS API key not configured',
            'error': 'Missing API key'
        }
    
    if not phone_numbers:
        return {
            'success': False,
            'message': 'No phone numbers provided'
        }
    
    # Clean phone numbers (remove +91, spaces, hyphens)
    cleaned_numbers = []
    for num in phone_numbers:
        cleaned = num.strip().replace('+91', '').replace('-', '').replace(' ', '')
        if cleaned and len(cleaned) == 10 and cleaned.isdigit():
            cleaned_numbers.append(cleaned)
    
    if not cleaned_numbers:
        return {
            'success': False,
            'message': 'No valid phone numbers found'
        }
    
    # Prepare Fast2SMS request
    url = "https://www.fast2sms.com/dev/bulkV2"
    headers = {
        'authorization': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'route': 'q',  # Quick transactional route
        'message': message[:160],  # Limit to 160 chars
        'language': 'english',
        'flash': 0,
        'numbers': ','.join(cleaned_numbers)
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response_data = response.json()
        
        if response.status_code == 200 and response_data.get('return'):
            logger.info(f"SMS sent successfully to {len(cleaned_numbers)} numbers")
            return {
                'success': True,
                'message': 'SMS sent successfully',
                'request_id': response_data.get('request_id'),
                'recipients': len(cleaned_numbers)
            }
        else:
            logger.error(f"SMS failed: {response_data}")
            return {
                'success': False,
                'message': response_data.get('message', ['Unknown error'])[0],
                'error': response_data
            }
    
    except requests.exceptions.Timeout:
        logger.error("SMS request timeout")
        return {
            'success': False,
            'message': 'SMS service timeout',
            'error': 'Timeout'
        }
    except Exception as e:
        logger.error(f"SMS error: {str(e)}")
        return {
            'success': False,
            'message': f'SMS error: {str(e)}',
            'error': str(e)
        }


def create_transaction_sms(transaction_type: str, amount: float, category: str, 
                          transaction_date: str, reference_number: Optional[str] = None) -> str:
    """
    Create SMS message for transaction
    
    Returns:
        str: Formatted SMS message
    """
    ref_text = f" Ref: {reference_number}" if reference_number else ""
    message = f"DreamLadder: {transaction_type.title()} of Rs.{amount:,.0f} recorded. Type: {category}. Date: {transaction_date}.{ref_text}"
    return message[:160]


def create_receipt_sms(receipt_number: str, amount: float, customer_name: str, 
                      issue_date: str) -> str:
    """
    Create SMS message for receipt
    
    Returns:
        str: Formatted SMS message
    """
    message = f"DreamLadder: Receipt #{receipt_number} generated. Amount: Rs.{amount:,.0f}. Customer: {customer_name}. Date: {issue_date}"
    return message[:160]


def get_cofounder_phones() -> List[str]:
    """
    Get co-founder phone numbers from environment
    
    Returns:
        List[str]: List of phone numbers
    """
    cofounder_phones = os.environ.get('COFOUNDER_PHONES', '')
    if not cofounder_phones:
        return []
    
    return [p.strip() for p in cofounder_phones.split(',') if p.strip()]


def send_transaction_sms(transaction_data: dict, customer_phone: Optional[str] = None) -> Dict[str, Any]:
    """
    Send SMS notification for a transaction
    
    Args:
        transaction_data: Transaction details dict
        customer_phone: Optional customer phone number
    
    Returns:
        dict: SMS send result
    """
    # Collect phone numbers
    phone_numbers = get_cofounder_phones()
    if customer_phone:
        phone_numbers.append(customer_phone)
    
    if not phone_numbers:
        return {
            'success': False,
            'message': 'No recipients configured'
        }
    
    # Create message
    message = create_transaction_sms(
        transaction_type=transaction_data.get('type', 'Transaction'),
        amount=float(transaction_data.get('amount', 0)),
        category=transaction_data.get('category', 'General'),
        transaction_date=transaction_data.get('transaction_date', ''),
        reference_number=transaction_data.get('reference_number')
    )
    
    return send_sms(phone_numbers, message)


def send_receipt_sms(receipt_data: dict) -> Dict[str, Any]:
    """
    Send SMS notification for a receipt
    
    Args:
        receipt_data: Receipt details dict
    
    Returns:
        dict: SMS send result
    """
    # Collect phone numbers
    phone_numbers = get_cofounder_phones()
    customer_phone = receipt_data.get('customer_phone')
    if customer_phone:
        phone_numbers.append(customer_phone)
    
    if not phone_numbers:
        return {
            'success': False,
            'message': 'No recipients configured'
        }
    
    # Create message
    message = create_receipt_sms(
        receipt_number=receipt_data.get('receipt_number', 'N/A'),
        amount=float(receipt_data.get('amount', 0)),
        customer_name=receipt_data.get('customer_name', 'Customer'),
        issue_date=receipt_data.get('issue_date', '')
    )
    
    return send_sms(phone_numbers, message)
