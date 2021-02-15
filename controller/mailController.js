const nodemailer = require('nodemailer'); 

exports.send = (token, email) =>{

    const content = "http://localhost:8000/user/verify?id="+token
    
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: 'muditalbet@gmail.com', 
            pass: 'Mudit@7073863026'
        } 
        }); 
    let mailDetails = { 
        from: 'muditalbet@gmail.com', 
        to: email, 
        subject: 'Test mail', 
        text: 'Node.js testing mail for Declutter: ' + content
    }; 
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs'); 
        } else { 
            console.log('Email sent successfully'); 
        } 
    });         
}

