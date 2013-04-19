#-*- coding:utf-8 -*-
class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'development key'
    DATABASE_URI = 'mysql://fu@localhost/youtube'
    UPLOAD_FOLDER = '/home/fu/cloud/assignment2/uploads/'
    ALLOWED_EXTENSIONS = set(['mp4', 'mkv', 'avi','mov'])
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    S3_BUCKET_NAME = u'youtube'
    RDS= True
    CLOUDFORNT = True

class ProductionConfig(Config):
    DATABASE_URI = 'mysql://%s@%s/%s' % ('fu','fupass','youtube')

class DevelopmentConfig(Config):
    DEBUG = True
#    DATABASE_URI = 'mysql://%s@%s/%s' % ('fu','fupass','youtube')
    S3 = True
    CLOUDFORNT = True
    RDS= True

class TestingConfig(Config):
    TESTING = True
