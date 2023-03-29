import { NextApiResponse, NextApiRequest } from 'next';
import getConfig from 'next/config';
import axios from 'axios';
import { getDirectusClient } from '../../lib/directus';

const nodemailer = require('nodemailer');

const mailTransport = process.env.MAIL_TRANSPORT;
const mailjetPublic = process.env.MAILJET_PUBLIC;
const mailjetPrivate = process.env.MAILJET_PRIVATE;
const mailjetUrl = process.env.MAILJET_URL;
const mailjetEmailFrom = process.env.MAILJET_EMAIL_FROM;
const smtpHost = process.env.MAIL_SMTP_HOST;
const smtpPort = process.env.MAIL_SMTP_PORT;
const smtpSecure = process.env.MAIL_SMTP_SECURE;
const smtpUser = process.env.MAIL_SMTP_USER;
const smtpPass = process.env.MAIL_SMTP_PASS;

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface IntegrationProps {
  type: string;
  url?: string;
  email?: string;
}

const getForm = async (id: string) => {
  const directus = await getDirectusClient();
  const { data } = await directus.items(`${prefix}forms`).readByQuery({
    fields: [`integrations.${prefix}form_integrations_id.*`],
    filter: { id: { _eq: id } },
  });
  if (!data || data.length !== 1) {
    return null;
  }
  const { integrations } = data[0];
  return integrations.map((integration: IntegrationProps) => Object.values(integration)[0]);
};

const sendMailjetMail = async (to: string, data: any, content: any) => {
  const message = {
    From: {
      Email: mailjetEmailFrom,
    },
    To: [{ Email: to }],
    Subject: data.formName,
    TextPart: content.join('\n'),
    HtmlPart: content.join('<br />'),
  };
  const encodedBase64Token = Buffer.from(`${mailjetPublic}:${mailjetPrivate}`).toString('base64');
  const authorization = `Basic ${encodedBase64Token}`;
  await axios({
    method: 'post',
    url: mailjetUrl,
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ Messages: [message] }),
  });
};

const sendSmtpMail = async (to: string, data: any, content: any) => {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  await transporter.sendMail({
    from: smtpUser,
    to,
    subject: data.formName,
    text: content.join('\n'),
    html: content.join('<br />'),
  });
};

const sendMail = async (to: string, data: any) => {
  const content: any = [];
  Object.entries(data).forEach(([key, value]) => {
    content.push(`${key}: ${value}`);
  });
  if (mailTransport === 'smtp') {
    await sendSmtpMail(to, data, content);
  } else {
    await sendMailjetMail(to, data, content);
  }
};

const sendWebhook = async (formIntegrationWebhook: string, data: any) => {
  await axios({
    method: 'post',
    url: formIntegrationWebhook,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
};

const saveSubmission = async (data: any) => {
  const directus = await getDirectusClient();
  const { formName, name, email, slug } = data;

  const { data: user }: any = await directus.items(`${prefix}users`).readByQuery({
    filter: { email: { _eq: email } },
  });
  let userId;
  if (!user || user.length === 0) {
    const res: any = await directus.items(`${prefix}users`).createOne({
      email,
      name,
    });
    userId = res?.id;
  } else {
    userId = user[0].id;
  }
  const submission = {
    formName,
    formSubmissionDate: new Date(),
    formData: JSON.stringify(data, null, 2),
    page: null,
    user: userId,
  };
  const { data: page } = await directus.items(`${prefix}pages`).readByQuery({
    fields: ['id'],
    filter: { slug: { _eq: slug } },
  });
  if (page && page.length === 1) {
    const { id: pageId } = page[0];
    submission.page = pageId;
  }
  await directus.items(`${prefix}form_submissions`).createOne(submission);
};

const createSubmission = async (data: any) => {
  const { formId } = data;
  const integrations = await getForm(formId);
  await saveSubmission(data);
  await integrations.reduce(async (lastPromise: any, integration: IntegrationProps) => {
    const accum = await lastPromise;
    const { type, email, url } = integration;
    switch (type) {
      case 'mail':
        if (email) {
          await sendMail(email, data);
        }
        break;
      case 'webhook':
        if (url) {
          await sendWebhook(url, data);
        }
        break;
    }
    return [...accum, {}];
  }, Promise.resolve([]));
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = _req;
  if (method === 'POST') {
    await createSubmission(body);
  }
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).json({
    message: 'Ok',
  });
}
