import AWS from 'aws-sdk';
import fs from 'fs';

const spacesEndpoint = new AWS.Endpoint(process.env.ENDPOINT)
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export default function fileDelete(old_file_name, new_file, callback) {
    let bucket = process.env.BUCKET_NAME || null;
    var params = {
        Bucket: bucket,
        Key: old_file_name
    };

    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log("deleted");
            if (new_file && bucket) {
                const fileContent = fs.readFileSync(new_file.path)
                const now = new Date()
                let file_name = new_file.filename || now

                file_name = file_name.replace(/\s+/g, ' ')
                file_name = file_name.trim()
                file_name = file_name.replace(' ', '')

                const params = {
                    Bucket: bucket,
                    Key: file_name,
                    Body: fileContent,
                    ACL: 'public-read'
                }

                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('Error uploading file:', err)
                        callback({ data: null, success: false, error: err })
                    } else {
                        console.log('File uploaded successfully. Location:', data.Location)
                        callback(data, err)
                    }
                })
            } else {
                callback({ data: null, success: false, error: 'Invalid parameters' })
            }
        }
    });
}