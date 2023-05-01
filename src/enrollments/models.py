from sqlalchemy import Column, ForeignKey, Integer, MetaData, Table, String
from src.auth.models import user

metadata = MetaData()


activity = Table(
    'activity',
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
)


enrollment = Table(
    'enrollment',
    metadata,
    Column("user_id", Integer, ForeignKey(user.c.id),primary_key=True),
    Column("activity_id", Integer, ForeignKey(activity.c.id),primary_key=True),

)
