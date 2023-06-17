import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses'
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "us-east-1",
    defaultProvider
})

const transporter = nodemailer.createTransport({
    SES: { ses, aws }
});

module.exports = { transporter }