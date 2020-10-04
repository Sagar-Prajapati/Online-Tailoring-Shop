function Next()
{
	var userfit = document.getElementById("userfit");
	var stdsize = document.getElementById("stdsize");
	var sendtailor = document.getElementById("sendtailor");

	var userfitbox = document.getElementById("userfitbox");
	var stdsizebox = document.getElementById("stdsizebox");
	var sendtailorbox = document.getElementById("sendtailorbox");
	if(userfit.checked)
  	{
  		if (userfitbox.style.display == "none") 
		{
			userfitbox.style.display="block";
			stdsizebox.style.display="none";
			sendtailorbox.style.display="none";
		}
		else
		{
			userfitbox.style.display="none";
		}
  	}
  	else if(stdsize.checked)
  	{
  		if (stdsizebox.style.display == "none") 
		{
			userfitbox.style.display="none";
			stdsizebox.style.display="block";
			sendtailorbox.style.display="none";
		}
		else
		{
			stdsizebox.style.display="none";
		}
  	}
  	else if(sendtailor.checked)
  	{
  		if (sendtailorbox.style.display == "none") 
		{
			userfitbox.style.display="none";
			stdsizebox.style.display="none";
			sendtailorbox.style.display="block";
		}
		else
		{
			sendtailorbox.style.display="none";
		}
  	}
}





function convert()
{
	var cousin = document.getElementById("cousinconvert");
	var curtains = document.getElementById("curtainsconvert");
	var other = document.getElementById("otherconvert");

	var convertbox = document.getElementById("otherconvertbox");
  	if(other.checked)
  	{
  		document.getElementById("cousinconvert").checked = false;
  		document.getElementById("curtainsconvert").checked = false;
  		document.getElementById("cousinconvert").disabled = true;
  		document.getElementById("curtainsconvert").disabled = true;
  		if (convertbox.style.display == "none") 
		{
			convertbox.style.display="block";
		}
		else
		{
			convertbox.style.display="none";
		}
  	}
  	else
  	{
  		document.getElementById("cousinconvert").disabled = false;
  		document.getElementById("curtainsconvert").disabled = false;
		convertbox.style.display="none";
  	}
}
