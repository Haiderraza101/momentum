import bcrypt from 'bcrypt';

async function testPassword() {
  try {
    const password = 'Test@1234';
    const storedHash = '$2b$10$4RqG.ZCJY1hZrB0P3ejqA.ZmDD90vE9mQ5.SjK5k8EPLw1H4RyBvK';
    
    console.log('Testing password:', password);
    console.log('Stored hash:', storedHash);
    
 
    const match = await bcrypt.compare(password, storedHash);
    console.log('Direct comparison result:', match);
    
   
    const saltRounds = 10;
    const newHash = await bcrypt.hash(password, saltRounds);
    console.log('Newly generated hash:', newHash);
    console.log('Compare new hash with stored:', await bcrypt.compare(password, newHash));
  } catch (err) {
    console.error('Error in test:', err);
  }
}

testPassword();