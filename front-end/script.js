const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
console.log("✅ Script file loaded successfully");

menuIcon.onclick=()=>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//Contact form
const form = document.getElementById('contact-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        fullname: form.querySelector('input[name="fullname"]').value,
        email: form.querySelector('input[name="email"]').value,
        phone: form.querySelector('input[name="phone"]').value,
        subject: form.querySelector('input[name="subject"]').value,
        message: form.querySelector('textarea[name="message"]').value
    };
    console.log('Form Data Sent:', formData);
    try {
        const response = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            form.reset();
        } else {
            alert('Failed to send message.');
        }
    } catch (error) {
        alert('Error sending message.');
        console.error(error);
    }
});

//Register form

const registerForm= document.getElementById('register-form');
registerForm.addEventListener('submit', async function(event){
    event.preventDefault();

    const registerFormData = {
        fullname:registerForm.querySelector('input[name="fullname"]').value,
        email:registerForm.querySelector('input[name="email"]').value,
        password:registerForm.querySelector('input[name="password"]').value

    };

    try{
        const response=await fetch('http://localhost:5000/register',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerFormData)
        });
        if (response.ok) {
            alert('Registration successful!');
            registerForm.reset();
        } else {
            alert('Registration failed.');
        }
    }
    catch (error) {
        console.error(error);
        alert('Error during registration.');
    }
});

//login
const loginForm=document.getElementById('login-form');
loginForm.addEventListenner('submit',async(event)=>{
    event.preventDefault();

    const email=loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try{
        const response = await fetch('http://localhost:5000/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({email,password}),
        });
        if(response.ok){
            const data=await response.json();
            alert(data.msg); //登录成功提示
        }else{
            const error=await response.json();
            alert(error.msg); //登录失败提示
        }
    }catch(error){
        console.error('Error:',error);
        alert('An error occurred while logging in.')
    }
})