from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, Text, DateTime, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum
from config import settings

Base = declarative_base()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class PropertyType(str, enum.Enum):
    RESIDENTIAL = "residential"
    AGRICULTURAL = "agricultural"
    COMMERCIAL = "commercial"

class PropertyStatus(str, enum.Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    UPCOMING = "upcoming"

class EnquiryType(str, enum.Enum):
    CALLBACK = "callback"
    PROPERTY_ENQUIRY = "property_enquiry"
    GENERAL = "general"

class EnquiryStatus(str, enum.Enum):
    PENDING = "pending"
    CONTACTED = "contacted"
    CLOSED = "closed"

class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionCategory(str, enum.Enum):
    # Income categories
    PROPERTY_SALE = "property_sale"
    COMMISSION = "commission"
    CONSULTATION_FEE = "consultation_fee"
    OTHER_INCOME = "other_income"
    
    # Expense categories
    MARKETING = "marketing"
    SALARY = "salary"
    OFFICE_RENT = "office_rent"
    UTILITIES = "utilities"
    MAINTENANCE = "maintenance"
    LEGAL_FEES = "legal_fees"
    TAXES = "taxes"
    OTHER_EXPENSE = "other_expense"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CHEQUE = "cheque"
    UPI = "upi"
    CARD = "card"
    OTHER = "other"

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(String, primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    short_description = Column(String(500))
    price = Column(Float, nullable=False)
    price_per_sqft = Column(Float)
    area = Column(String(100), nullable=False)
    area_in_sqft = Column(Integer)
    location = Column(String(255), nullable=False)
    full_address = Column(Text)
    google_maps_link = Column(String(500))
    type = Column(SQLEnum(PropertyType), nullable=False)
    status = Column(SQLEnum(PropertyStatus), default=PropertyStatus.AVAILABLE)
    featured = Column(Boolean, default=False)
    images = Column(JSON, default=list)
    amenities = Column(JSON, default=list)
    highlights = Column(JSON, default=list)
    legal_info = Column(JSON, default=dict)
    nearby_places = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    enquiries = relationship("Enquiry", back_populates="property")

class Enquiry(Base):
    __tablename__ = "enquiries"
    
    id = Column(String, primary_key=True)
    type = Column(SQLEnum(EnquiryType), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(20), nullable=False)
    message = Column(Text)
    preferred_time = Column(String(100))
    property_id = Column(String, ForeignKey("properties.id", ondelete="SET NULL"))
    status = Column(SQLEnum(EnquiryStatus), default=EnquiryStatus.PENDING)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    property = relationship("Property", back_populates="enquiries")

class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(String, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(50), default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    
    id = Column(String, primary_key=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True)
    type = Column(SQLEnum(TransactionType), nullable=False)
    category = Column(SQLEnum(TransactionCategory), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text)
    payment_method = Column(SQLEnum(PaymentMethod))
    reference_number = Column(String(100))
    property_id = Column(String, ForeignKey("properties.id", ondelete="SET NULL"))
    customer_name = Column(String(255))
    customer_phone = Column(String(20))
    customer_email = Column(String(255))
    transaction_date = Column(DateTime, nullable=False)
    notes = Column(Text)
    created_by = Column(String, ForeignKey("admin_users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    property = relationship("Property", foreign_keys=[property_id])
    creator = relationship("AdminUser", foreign_keys=[created_by])

class Receipt(Base):
    __tablename__ = "receipts"
    
    id = Column(String, primary_key=True)
    receipt_number = Column(String(100), unique=True, nullable=False)
    transaction_id = Column(String, ForeignKey("transactions.id", ondelete="CASCADE"))
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20))
    customer_email = Column(String(255))
    customer_address = Column(Text)
    amount = Column(Float, nullable=False)
    amount_in_words = Column(String(500))
    description = Column(Text, nullable=False)
    payment_method = Column(SQLEnum(PaymentMethod))
    property_details = Column(JSON)
    issue_date = Column(DateTime, nullable=False)
    notes = Column(Text)
    created_by = Column(String, ForeignKey("admin_users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    transaction = relationship("Transaction", foreign_keys=[transaction_id])
    creator = relationship("AdminUser", foreign_keys=[created_by])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
