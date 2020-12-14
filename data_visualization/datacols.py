import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import boto3
import os

def lambda_handler(event, context):
    data_name = '/tmp/dataset.csv'

    #Get dataset from S3
    
    s3 = boto3.client('s3')
    try:
        s3.download_file(os.environ['BUCKET_NAME'], 'dataset.csv', data_name)

        file_content = ''
        with open(data_name) as f:
            file_content = f.read()
            
        df = pd.read_csv(data_name)
        cols = df.columns.tolist()
        
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headrs": "Content-Type",
                "Access-Control_Allow-Methods": "OPTIONS,GET"
            },
            'body': json.dumps({'response': repr(e)})
        }

    return {
        'statusCode': 200,
        'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headrs": "Content-Type",
                "Access-Control_Allow-Methods": "OPTIONS,GET"
        },
        'body': json.dumps({'response': cols})
    }
