import AWS from 'aws-sdk';

export async function uploadToS3(file:File){
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
           params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME },
              region: process.env.NEXT_PUBLIC_S3_REGION,
        });

        const fil_key = 'upload/' + Date.now().toString() + file.name.replace(' ', '_');
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: fil_key,
            Body: file,
            ContentType: file.type,
        };
       
        const uploadToS3 =  s3.putObject(params).on('httpUploadProgress', (evt) => {
            console.log(`Uploading file: ${((evt.loaded*100)/evt.total).toString()}%`);
        }).promise();
        
        await uploadToS3.then((data)=>{
            console.log('File uploaded successfully:', data);
        })

        return Promise.resolve({
            file_key: fil_key,
            file_url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fil_key}`,
            file_name: file.name,
    });




    } catch (error) {
        
    }
}



export function getS3FileUrl(file_key: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
}  