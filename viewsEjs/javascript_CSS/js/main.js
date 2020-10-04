//input only alphabet values
function alphaOnly(event){
    var key=event.keyCode;
    return ((key>=65 && key<=90)||key==8||key==32);
  };
//input only numberic values
function numOnly(event){
    var key=event.keyCode;
    return ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)|| key==8 || key==9);
  };

 function limitNumbersPin(){
    var pincode = document.getElementById("pincode");
    if(pincode.value.length!=6){
      alert("Enter 6 Dight Pincode Number");
      pincode.value="";
    }
    else{
      return;
    }
 } 
 
 function limitNumbersCont(){
  var contact = document.getElementById("contact");
  if(contact.value.length!=10){
    alert("Enter 10 Dight Contact Number");
    contact.value="";
  }
  else{
    return;
  }
} 
  
//email validation
function validateEmail(emailField){
   // var reg = /^([A-Za-z0-9_\-\.])+\@()+\.([A-Za-z]{2,4})$/;
     var reg=/^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/
    if (!reg.test(emailField.value) == false) 
    {
        return true;
    }
    else{
        alert('Invalid Email Address');
        return false;
    
    }   
}

//compare password
function validate() {
    var pass= document.getElementById("pass");
    var re_pass= document.getElementById("re_pass");
    if(pass.value==re_pass.value||pass.value==""||re_pass.value=="")
    { 
        return true;
    }
    else
    {
        alert("password not same"); 
        return false;
    }   
}

function validate_For_Reset() {
  var pass= document.getElementById("new_pass");
  var re_pass= document.getElementById("confirm_new_pass");
  if(pass.value==re_pass.value||pass.value==""||re_pass.value=="")
  { 
      return true;
  }
  else
  {
      alert("password not same"); 
      return false;
  }   
}

function checkBirthDate(){
  var bday = document.getElementById("birthdate").value;
  var current_date = new Date();
  var get_year = current_date.getFullYear();
  Date_length = bday.length;
  
  date_slice = bday.slice(0,4);

  if(bday == "")
  {
    alert("Please enter Date of birth");
  }
  else if(get_year - date_slice < 18)
  {
    alert("Your are not 18 year old");
    document.getElementById("birthdate").value = "";
  }
  else if(get_year-date_slice>60)
  {
     alert("Your are not Applicable for this service\nbacause you are more than 60 years old ");
     document.getElementById("birthdate").value = "";
  } 
  else
  {
      return
  }
}






//image uploads
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var div_id  = $(input).attr('set-to');
        reader.onload = function (e) {
            $('#'+div_id).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$(".rounded").change(function(){
    readURL(this);
});


// Checking for Pico and Fall
function CheckValue()
{
  var checkbox1 = document.getElementById("SelectedFall");
  var text1 = document.getElementById("SelFall");
  
  var checkbox2 = document.getElementById("SelectedPico");
  var text2 = document.getElementById("SelPico");

  if(checkbox1.checked == true)
  {
    text1.value="true";
  }
  else{
    text1.value="false";
  }
  
  if(checkbox2.checked == true)
  {
    text2.value="true";
  }
  
  else{
    text2.value="false";
  }
}