async function testDelete() {
  try {
    // 1. Login as admin
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hospital.com',
        password: 'admin123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Logged in, got token.');

    // 2. Fetch patients
    const patientsRes = await fetch('http://localhost:5000/api/patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const patientsData = await patientsRes.json();
    const patients = patientsData.data;
    if (patients.length === 0) {
      console.log('No patients to delete.');
      return;
    }
    const patientToDelete = patients[0];
    console.log('Attempting to delete patient:', patientToDelete._id);

    // 3. Delete patient
    const deleteRes = await fetch(`http://localhost:5000/api/patients/${patientToDelete._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const deleteData = await deleteRes.json();
    console.log('Delete response:', deleteData);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testDelete();
