const path = require('path');

const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	// port: 587,
	// secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

async function sendWelcomeEmail(recipient, appUserName) {
	try {
		await transporter.sendMail({
			from: `ChanuaRaiya <${process.env.EMAIL_USER}>`,
			to: `${recipient}`,
			subject: `Thanks for registering `,
			html: `
                <h1>Vipi ${appUserName}, Welcome to ChanuaRaiya!</h1>
                <p>We’re excited to have you on board. By joining ChanuaRaiya means you will get access to goverment documents and an ai model to help you understand them to their entirety. A platform to air out your views and opinions on certain topics, get involved in public participation and report incidents as they happen around you.</p><br/>
                <p>Kaa rada na uchanue raiya, <br/>Team ya ChanuaRaiya</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}
async function sendTopicCreationEmail(recipient, appUserName, topic) {
	try {
		await transporter.sendMail({
			from: `ChanuaRaiya <${process.env.EMAIL_USER}>`,
			to: `${recipient}`,
			subject: `New Discussion Underway`,
			html: `
                <h1>Vipi ${appUserName}, Kam Changia Hii!</h1>
                <p>A new discussion on "${topic}" has been started</p><br/>
                <p>Tusho Unafeel aje kuhusu hii stori?, <br/>Na Usisahau Ku-ChanuaRaiya</p>
            `,
		});
	} catch (error) {
		console.error('Error while sending email', error);
	}
}
module.exports = { sendWelcomeEmail, sendTopicCreationEmail };
