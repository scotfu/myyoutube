#-*- coding:utf-8 -*-
import os

class Config(object):
    DEBUG = False
    TESTING = False
    DATABASE_URI = 'sqlite://:memory:'
    SECRET_KEY = 'development key'
    UPLOAD_FOLDER = '/home/fu/tmp/upload'
    ALLOWED_EXTENSIONS = set(['mp4', 'mkv', 'avi'])
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    AWS_ACCESS_KEY = u'AKIAIH4MO2H2DF7T25EQ'
    AWS_SECRET_KEY = u'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'
    S3_BUCKET_NAME = u'youtube'

class ProductionConfig(Config):
    DATABASE_URI = 'mysql://%s@%s/%s' % ('fu','fupass','youtube')

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = 'mysql://%s@%s/%s' % ('fu','fupass','youtube')


class TestingConfig(Config):
    TESTING = True