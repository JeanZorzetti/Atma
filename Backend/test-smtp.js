#!/usr/bin/env node

/**
 * SMTP Diagnostic Tool
 * Tests SMTP connection and configuration
 *
 * Usage: node test-smtp.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('========================================');
console.log('  SMTP Configuration Test');
console.log('========================================\n');

// 1. Check environment variables
console.log('1️⃣  Checking environment variables...\n');

const requiredVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM_ADDRESS'
];

let allVarsPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'SMTP_PASS') {
      console.log(`✅ ${varName}: ${'*'.repeat(value.length)} (hidden)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please configure all SMTP variables in .env or environment.\n');
  process.exit(1);
}

console.log('\n========================================\n');

// 2. Test SMTP connection
console.log('2️⃣  Testing SMTP connection...\n');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true  // Log to console
});

console.log('Configuration:');
console.log(`  Host: ${process.env.SMTP_HOST}`);
console.log(`  Port: ${process.env.SMTP_PORT}`);
console.log(`  Secure: ${process.env.SMTP_SECURE === 'true'}`);
console.log(`  User: ${process.env.SMTP_USER}`);
console.log('');

transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection successful!\n');
    console.log('========================================\n');

    // 3. Send test email
    console.log('3️⃣  Sending test email...\n');

    const testEmail = process.env.SMTP_USER; // Send to self

    return transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Atma Test'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER}>`,
      to: testEmail,
      subject: 'SMTP Test - Atma Backend',
      text: `SMTP test successful at ${new Date().toISOString()}!\n\nIf you received this email, your SMTP configuration is working correctly.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ SMTP Test Successful!</h2>
          <p>Test completed at: <strong>${new Date().toLocaleString('pt-BR')}</strong></p>
          <p>If you received this email, your SMTP configuration is working correctly.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Atma Backend - Notification System Test
          </p>
        </div>
      `
    });
  })
  .then((info) => {
    console.log('✅ Test email sent successfully!\n');
    console.log('Message Info:');
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log('');
    console.log('========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('========================================\n');
    console.log('Your SMTP configuration is working correctly.');
    console.log(`Check ${process.env.SMTP_USER} inbox for the test email.\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.log('');
    console.log('========================================');
    console.log('❌ SMTP ERROR');
    console.log('========================================\n');

    console.error('Error details:');
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Message: ${error.message}`);

    if (error.code === 'EAUTH') {
      console.log('\n🔑 AUTHENTICATION ERROR\n');
      console.log('Possible causes:');
      console.log('  1. Incorrect email or password');
      console.log('  2. For Gmail: You need an "App Password", not your regular password');
      console.log('     Generate one at: https://myaccount.google.com/apppasswords');
      console.log('  3. For Gmail: Enable "Less secure app access" (not recommended)');
      console.log('  4. Two-factor authentication not enabled (required for App Passwords)');
    } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      console.log('\n🌐 CONNECTION ERROR\n');
      console.log('Possible causes:');
      console.log('  1. Firewall blocking port 587');
      console.log('  2. Wrong SMTP host or port');
      console.log('  3. Network/DNS issues');
      console.log('  4. SMTP server is down');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n⏱️  TIMEOUT ERROR\n');
      console.log('Possible causes:');
      console.log('  1. Server firewall blocking outbound SMTP');
      console.log('  2. SMTP server not responding');
      console.log('  3. Wrong port (try 465 for SSL or 25)');
    }

    console.log('\n📝 Full error stack:\n');
    console.error(error);
    console.log('');
    process.exit(1);
  });
