const sgMail = require('@sendgrid/mail')


const MailService = async({email,subject,body})=>{
    sgMail.setApiKey('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')
    const msg = {
    to: 'ajithkumarbe97@gmail.com' , // Change to your recipient
    from: 'ajithkumarbe97@gmail.com', // Change to your verified sender
    subject: 'Book MyShow',
    text: 'Your Ticket Booked',
    html: '<strong></strong>',
    }
    sgMail
   .send(msg)
   .then((res) => {
    console.log('Email sent')
    })
   .catch((error) => {
    console.error(error)
    })
}

module.exports = {MailService}

