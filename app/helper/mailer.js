const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

class Mailer {
    constructor() {
        //this._transport = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        this._transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_APP_PASSWORD,
            }
        })
    }

    /* @Method: sendMail
    // @Description: For sendmail
    */
    async sendMail (from, to, subject, tplName, locals) {
        try {
            const mailer = new Mailer();
            const templateDir = path.join(__dirname, "../views/", 'email-templates', tplName+'/html')
     
            //var Email = new EmailTemplate(templateDir)
            const email = new Email({
                message: {
                    from: from
                },
                transport: {
                    jsonTransport: true
                },
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs' 
                    }
                }
            }); 
    
            let getResponse = await email.render(templateDir,locals);
    
    
            if(getResponse) {
                let options = {
                    from: from,
                    to: to,
                    subject: subject,
                    html:  getResponse
                };
            
                let mailresponse = await mailer._transport.sendMail(options);
            
                
                if(mailresponse){
                    return true;
                } else {
                    return false;
                }
            }
        
        }
        catch(e)
        {
            console.log(e.message);
            return false;
        }
   
    };

  /* @Method: sendMailUser
    // @Description: For sendmail
    */
    async sendMailUser (from, to, subject, tplName, locals) {
        try {
            const mailer = new Mailer();
            const templateDir = path.join(__dirname, "../views/", 'email-templates', tplName+'/html')
     
            //var Email = new EmailTemplate(templateDir)
            const email = new Email({
                message: {
                    from: from
                },
                transport: {
                    jsonTransport: true
                },
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs' 
                    }
                }
            }); 
    
            let getResponse = await email.render(templateDir,locals);
    
    
            if(getResponse) {
                let options = {
                    from: from,
                    to: to,
                    subject: subject,
                    html:  getResponse
                };
            
                let mailresponse = await mailer._transport.sendMailUser(options);
            
                
                if(mailresponse){
                    return true;
                } else {
                    return false;
                }
            }
        
        }
        catch(e)
        {
            console.log(e.message);
            return false;
        }
   
    };

    async sendMailUserClient (from, to, subject, tplName) {
        try {
            const mailer = new Mailer();
            const templateDir = path.join(__dirname, "./app/modules/user/views/",tplName)
     
            //var Email = new EmailTemplate(templateDir)
            const email = new Email({
                message: {
                    from: from
                },
                transport: {
                    jsonTransport: true
                },
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs' 
                    }
                }
            }); 
    
            let getResponse = await email.render(templateDir,locals);
    
    
            if(getResponse) {
                let options = {
                    from: from,
                    to: to,
                    subject: subject,
                    html:  getResponse
                };
            
                let mailresponse = await mailer._transport.sendMailUserClient(options);
            
                
                if(mailresponse){
                    console.log("MAIL RESPONSE",mailresponse)
                    return true;
                } else {
                    return false;
                }
            }
        
        }
        catch(e)
        {
            console.log(e.message);
            return false;
        }
   
    };



}
module.exports = new Mailer();



