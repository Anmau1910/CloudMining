import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import boto3
import os

def lambda_handler(event, context):

    file_name = 'scatter_plt.png'
    data_name = '/tmp/dataset.csv'
    
    #Get dataset from S3
    
    s3 = boto3.client('s3')
    s3.download_file(os.environ['BUCKET_NAME'], 'dataset.csv', data_name)
    
        
    file_content = ''
    with open(data_name) as f:
        file_content = f.read()
    
    
    df = pd.read_csv(data_name)
    
    #Set a style
    plt.style.use('ggplot')
    
    #Get features from user input
    if event.get('queryStringParameters') is None:
        return{
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            'body': json.dumps({
            'response': 'Bad request' })
        }

    x = event.get('queryStringParameters').get('x')
    y = event.get('queryStringParameters').get('y')
    c = event.get('queryStringParameters').get('c')
    cmap = None
    
    if (x is None) or (y is None):
        return{
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            'body': json.dumps({
            'response': 'Bad request' })
        }

    if (c is not None) or (c != ''):
        cmap = 'coolwarm'
    
    #Use panda's data visualization library to create a scatter plot
    try:
        df.plot.scatter(x=x,y=y,c=c,cmap=cmap)
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            'body': json.dumps({'response': repr(e)})
        }

    #Save our figure to a temp directory
    plt.savefig(f'/tmp/{file_name}')
    
    #Move it to our S3 Bucket
    
    with open(f'/tmp/{file_name}', 'rb') as fig:
        s3 = boto3.resource('s3') 
        s3.Bucket(os.environ['BUCKET_NAME']).put_object(
                Key=f'plots/{file_name}',
                Body=fig,
                ContentType='image/png',
                ACL='public-read'
            )

    return {
        'statusCode': 200,
        'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        'body': json.dumps({'response':f'https://{os.environ["BUCKET_NAME"]}.s3.amazonaws.com/plots/{file_name}'})
    }