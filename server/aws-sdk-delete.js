import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint(process.env.ENDPOINT)
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export default function fileDelete(file_name, callback) {
    let bucket = process.env.BUCKET_NAME || null;
    var params = {
        Bucket: bucket,
        Key: file_name
    };

    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log("deleted");
            callback(data, err);
        }
    });
}