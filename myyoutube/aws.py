import boto
import boto.s3
import boto.rds
from myyoutube import app

class Storage:
    def __init__(self):
        self.conn=boto.connect_s3(aws_access_key_id =app.config['AWS_ACCESS_KEY'], aws_secret_access_key = app.config['AWS_SECRET_KEY'])
        print 'instablish connection for s3'
    def create_bucket(self, name):
        name = u'shancong-fu-'+ name
        bucket = self.conn.create_bucket(name)
        return bucket

    def save_string(self, bucket, name, value):
        k=boto.s3.key.Key(bucket)
        k.key=name
        k.set_contents_from_string(value)
    
    def get_string(self,bucket,name):
        k=boto.s3.key.Key(bucket)
        k.key=name
        return k.get_contents_as_string()

    def save_file(self, bucket, name,file):
        k=boto.s3.key.Key(bucket)
        k.key=name
        print type(k)
        k.set_contents_from_file(file)
        k.make_public()

    def get_key_url(bucker_name,key_name):
        return s3.conn.generate_url(60, 'GET', bucket=b.name, key=k.name, force_http=True)

class CloudFront:
    def __init__(self):
        self.conn = boto.connect_cloudfront(aws_access_key_id =app.config['AWS_ACCESS_KEY'], aws_secret_access_key = app.config['AWS_SECRET_KEY'])

    def create_distr(self, origin, comment):
        distro = self.conn.create_distribution(origin=origin, enabled=True, comment=comment)


class RDS:
    def __init__(self):
        self.conn = boto.rds.RDSConnection(aws_access_key_id =app.config['AWS_ACCESS_KEY'], aws_secret_access_key = app.config['AWS_SECRET_KEY'])

    def create_instance(self, user_name, password,db_name):
        instance = self.conn.create_dbinstance('db-master-1', 5, 'db.t1.micro', user_name, password,db_name=db_name)

    def create_group(self, ip=None):
        sg = self.conn.create_dbsecurity_group('web_servers', 'Web front-ends')
        sg.authorize(cidr_ip='69.121.15.191/32')

    def get_address(self):
        return self.conn.get_all_dbinstances("db-master-1")[0].endpoint[0]

if __name__ == '__main__':
    pass
