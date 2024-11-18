import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

export function configureTemplateEngine() {
  return hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: path.join(__dirname, '..', 'templates'),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, '..', 'templates'),
    extName: '.hbs',
  });
}
