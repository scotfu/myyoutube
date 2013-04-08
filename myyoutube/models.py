#-*-coding:utf-8 -*-
from myyoutube.database import Base
from sqlalchemy import Column, Integer, String, DateTime

class Video(Base):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    filename = Column(String(50), unique=True)
    timestamp = Column(DateTime)
    rates = Column(Integer)
    

    def __init__(self, name=None, filename=None):
        self.name = name
        self.filename = filename
        self.rates= 0

    def __repr__(self):
        return '<Video %r>' % (self.name)
