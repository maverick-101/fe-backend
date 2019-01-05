const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
        db : {
            mongoUri: 'mongodb://localhost:27017/'
            dbname  : 'dev'
            
      },
  production: {
        db : {
            mongoUri: 'mongodb://localhost:27017/'
            dbname  : 'dev'
            
      },
      
      
    }
