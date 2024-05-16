// Regex
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

const form=document.querySelector('#form-todos')
const formInput= document.querySelector('#form-input')
const inputNumber=document.querySelector('#input-number') 
const formBtn = document.querySelector('#form-btn')
const todosList = document.querySelector('#todos-list') 
const closeBtn= document.querySelector('#cerrar-btn')
const notification = document.querySelector('.notification')
const user = JSON.parse(localStorage.getItem('user'))
// validacion
                      
let namevalidation= false; 
let numbervalidation= false; 
                            
let nameEditValidation = true;
let numberEditvalidation =true;

// data
// let Data=[]


// funciones
const validationInput =(input, validation)=>{
   const infoText =input.parentElement.children[1]
    if(input.value ===''){
        input.classList.remove('correct')
        infoText.classList.remove('show-info')        
        input.classList.remove('incorrect')
    }else if(validation){
        input.classList.add('correct')
        input.classList.remove('incorrect')
        infoText.classList.remove('show-info')
    }else{
        infoText.classList.add('show-info')
        input.classList.add('incorrect')
        input.classList.remove('correct')
    }
    if(namevalidation && numbervalidation){
       formBtn.disabled=false 
       formBtn.classList.add('active')
    }else{
        formBtn.disabled=true
    }
}

// evento para vlidar con el regex
formInput.addEventListener('input',e=>{
    namevalidation = REGEX_NAME.test(formInput.value)
    validationInput(formInput, namevalidation)
})

inputNumber.addEventListener('input', e => {
    numbervalidation = REGEX_NUMBER.test(inputNumber.value)
    validationInput(inputNumber, numbervalidation)
})


form.addEventListener('submit' , async e =>{
    e.preventDefault()

    // llevar a la base de datos
    const responseJ = await fetch(`http://localhost:3000/contactos`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            nombre:formInput.value,
            telefono:inputNumber.value,
            edit:false,
            user:user.username
        })
    })
    const response = await responseJ.json()
    console.log(response)

    const listItem = document.createElement('li')

    notification.innerHTML='Se añadio un contacto !'
    notification.classList.add('show-notification')
    setTimeout(() => {
        notification.classList.remove('show-notification')
    }, 5000);

    listItem.innerHTML=`
        <li class="todo-item" id="${response.id}">
            <button class="delete-btn">&#10006;</button>
                <span>${response.nombre}</span> <span>${response.telefono}</span>
            <button class="edit-btn">&#x270E;</button>
        </li>
    `
    todosList.append(listItem)
    formInput.value=''
    inputNumber.value=''
}) 


const getContact = async()=>{
    const response = await fetch(`http://localhost:3000/contactos`,{method:'GET'})
    const contacts = await response.json()
    console.log(contacts); 
   
    let userContacts = contacts.filter(contact => contact.user == user.username);
 
    userContacts.forEach(contac => {
        const listItem = document.createElement('li')
        listItem.innerHTML=`
            <li class="todo-item" id="${contac.id}">
                <button class="delete-btn">&#10006;</button>
                    <span class"${nameEditValidation? 'incorrect' : 'correct'}">${contac.nombre}</span> <span>${contac.telefono}</span>          
                      
                <button class="edit-btn">&#x270E;</button>
            </li>
        `
        todosList.append(listItem)
      
    });
}
getContact();




todosList.addEventListener('click', async e=>{
  

    if(e.target.classList.contains('delete-btn')){
     
        const id=e.target.parentElement.id
    
        await fetch(`http://localhost:3000/contactos/${id}`,{
            method:'DELETE'
        })
       
    
        e.target.parentElement.remove()

    }else if(e.target.classList.contains('edit-btn')){
         const id= e.target.parentElement.id;
       
        const editBtn = e.target.closest('.edit-btn');
        const nameEdit =e.target.parentElement.children[1];
        const numberEdit = e.target.parentElement.children[2];

       await fetch(`http://localhost:3000/contactos/${id}`,{
                method:'PATCH',
                
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    edit:nameEdit.classList.contains('check-todo') && numberEdit.classList.contains('check-todo')  ?false : true,
                    nombre:nameEdit.innerHTML ,
                    telefono:numberEdit.innerHTML 
                })
            });
            nameEdit.classList.toggle('check-todo')
            numberEdit.classList.toggle('check-todo')
        if (editBtn){
            const li = editBtn.parentElement;
            console.log(li);
            const nameEdit_1= li.children[1].innerHTML
            console.log(nameEdit_1,'aqui');
            const numberEdit_1= li.children[2].innerHTML
                if (li.classList.contains('editando')){
                li.classList.remove('editando')

                contacts=contacts.map(contact=>{
                    if(contact.id == li.id){
                        return{
                            id:contact.id,
                            nombre:nameEdit_1.innerHTML,
                            telefono:numberEdit_1.innerHTML,
                            edit:false,
                            user:user.username
                        }
                    }
                    return contact
                })
                    
                }else{
                    li.classList.add('editando')
                    nameEdit.setAttribute('contenteditable', 'true');
                    numberEdit.setAttribute('contenteditable', 'true');
                    editBtn.innerHTML = '&#10000;'
                   
                   
                    nameEdit.addEventListener('input',e=>{
                        nameEditValidation = REGEX_NAME.test(nameEdit.innerHTML )
                        validationInput(nameEdit, nameEditValidation)
                        if (nameEditValidation && numberEditvalidation) {
                          editBtn.disabled = false;
                          
                             
                        } else {
                          editBtn.disabled = true;
                          
                
                        }
                      });


                      numberEdit.addEventListener('input',e=>{
                        numberEditvalidation = REGEX_NUMBER.test(numberEdit.innerHTML)
                        validationInput(numberEdit, numberEditvalidation)
                              
                        if (nameEditValidation && numberEditvalidation) {
                          editBtn.disabled = false;
                          
                             
                        } else {
                          editBtn.disabled = true;
                          
                        }
                      })
                      
                      
                    
                }
            
           

            
            
            
         
            
           
           
         
        }else{
            nameEdit.removeAttribute('contenteditable','true');
            numberEdit.removeAttribute('contenteditable','true');
        }
         

        
            
            
            
        

        

    }
    
})

// cerrando session 


closeBtn.addEventListener('click',async e =>{
   
    localStorage.removeItem('user')
   
    window.location.href='../home/index.html';
    
});