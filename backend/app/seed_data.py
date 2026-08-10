"""
Database and Seed Dataset Initializer for DataPilot AI.
"""

import os
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.database.database import SessionLocal
from backend.app.models.user import User
from backend.app.models.dataset import Dataset, DatasetColumn
from backend.app.core.security import get_password_hash
from backend.app.core.config import settings
from backend.app.analysis.data_quality import calculate_data_quality_score


def seed_default_dataset():
    db: Session = SessionLocal()
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.email == "demo@datapilot.ai").first()
        if not demo_user:
            demo_user = User(
                email="demo@datapilot.ai",
                full_name="Senior Data Analyst",
                hashed_password=get_password_hash("demo1234"),
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        # Check if sample dataset exists
        existing_ds = db.query(Dataset).filter(Dataset.user_id == demo_user.id).first()
        if existing_ds:
            return

        # Create sample DataFrame
        import random
        random.seed(42)

        regions = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East"]
        products = ["DataPilot Enterprise", "AI Pilot Pro", "Cloud Analytics SDK", "DSA Engine License", "Automated Insights Module"]
        categories = ["Software", "SaaS Subscription", "SDK/API", "Enterprise License", "Support Services"]

        records = []
        for i in range(1, 201):
            qty = random.randint(5, 250)
            unit_price = random.choice([99.0, 199.0, 499.0, 1299.0, 2499.0, 4999.0])
            rev = round(qty * unit_price, 2)
            cost = round(rev * random.uniform(0.3, 0.65), 2)
            profit = round(rev - cost, 2)

            records.append({
                "Transaction_ID": 1000 + i,
                "Region": random.choice(regions),
                "Product_Name": random.choice(products),
                "Category": random.choice(categories),
                "Quantity": qty,
                "Unit_Price": unit_price,
                "Revenue": rev,
                "Cost": cost,
                "Profit": profit,
                "Rating": round(random.uniform(3.5, 5.0), 1)
            })

        df = pd.DataFrame(records)

        seed_filename = "ds_demo_financial_sales_2024.csv"
        file_path = os.path.join(settings.UPLOAD_DIR, seed_filename)
        df.to_csv(file_path, index=False)

        file_size = os.path.getsize(file_path)
        quality_res = calculate_data_quality_score(df)

        dataset = Dataset(
            user_id=demo_user.id,
            name="Global Sales & Revenue Dataset 2024",
            filename="financial_sales_2024.csv",
            file_path=file_path,
            file_size_bytes=file_size,
            rows_count=len(df),
            cols_count=len(df.columns),
            quality_score=quality_res["overall_score"],
            status="ready",
        )
        db.add(dataset)
        db.commit()
        db.refresh(dataset)

        for col in df.columns:
            dt = str(df[col].dtype)
            data_type = "number" if "int" in dt or "float" in dt else "string"
            db_col = DatasetColumn(
                dataset_id=dataset.id,
                name=str(col),
                data_type=data_type,
                missing_count=int(df[col].isnull().sum()),
                unique_count=int(df[col].nunique()),
            )
            db.add(db_col)

        db.commit()
        print(f"Successfully seeded sample dataset ID={dataset.id} with {len(df)} records!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding dataset: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_default_dataset()
