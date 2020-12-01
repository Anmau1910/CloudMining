import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import boto3
import os

def lambda_handler(event, context):
    data_name = '/tmp/cars.csv'

    # Get dataset from S3
    
    s3 = boto3.client('s3')
    s3.download_file(os.environ['BUCKET_NAME'], 'datasets/cars.csv', data_name)
    
    df = pd.read_csv(data_name)

    cols = df.columns.tolist()

    return {
        'status': 200,
        'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headrs": "Content-Type",
                "Access-Control_Allow-Methods": "OPTIONS,GET"
        }
        'body': json.dumps({'response': cols})
    }
