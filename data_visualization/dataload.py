import json
import boto3
import os
import pandas as pd
from cgi import parse_header, parse_multipart, FieldStorage
from io import BytesIO

def lambda_handler(event, context):
    data_content = event.get('body')
    file_path = '/tmp/dataset.csv'
    s3 = boto3.client('s3')
   
    try: 
        headers = {k.lower():v for k, v in event['headers'].items()}
        _, c_data = parse_header(headers['content-type'])
        
        fs = FieldStorage(fp=BytesIO(bytes(event['body'], 'utf-8')), headers=headers, environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': c_data})
        f = fs.getfirst('file')
        
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            'body': json.dumps({"response": 'Bad datafile', "event": repr(e)})
        }
    
    s3.put_object(Bucket=os.environ['BUCKET_NAME'], Key=os.path.basename(file_path), Body=f.decode())
        
    s3.download_file(os.environ['BUCKET_NAME'], os.path.basename(file_path), file_path)
   
    try:
        pd.read_csv(file_path,delimiter = ',', error_bad_lines=False)
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            'body': json.dumps({"response": 'Bad datafile', "event": str(e)})
        }
    
    return {
        'statusCode': 200,
        'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
        },
        'body': json.dumps({'response': 'ok'})
    }
