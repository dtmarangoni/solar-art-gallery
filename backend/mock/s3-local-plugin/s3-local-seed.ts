import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

import * as albumSeed from '../database/albumSeed.json';
import * as artSeed from '../database/artSeed.json';

// S3 client
const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: new AWS.Endpoint('http://localhost:6000'),
});

// Upload to S3 bucket the album cover images
albumSeed.forEach((seed) => {
    // File buffer data
    const fileBuffer = fs.readFileSync(`./mock/filestore/${seed.albumId}/${seed.albumId}.jpg`);
    // Upload the file to S3 filestore
    S3.putObject(
        {
            Bucket: 'solar-art-gallery-images-dev',
            Key: `${seed.albumId}/${seed.albumId}`,
            Body: fileBuffer,
            ContentType: 'image/jpeg',
        },
        (error) => {
            if (error) throw error;
        }
    );
});

// Upload to S3 bucket the arts images
artSeed.forEach((seed) => {
    // File buffer data
    const fileBuffer = fs.readFileSync(`./mock/filestore/${seed.albumId}/arts/${seed.artId}.jpg`);

    // Upload the file to S3 filestore
    S3.putObject(
        {
            Bucket: 'solar-art-gallery-images-dev',
            Key: `${seed.albumId}/arts/${seed.artId}`,
            Body: fileBuffer,
            ContentType: 'image/jpeg',
        },
        (error) => {
            if (error) throw error;
        }
    );
});
