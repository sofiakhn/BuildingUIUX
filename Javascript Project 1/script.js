// Sofia Khan 
// CS 639 Fall 2020
// Do NOT modify any files outside of this.

let hasLoadedFriendsAndFamilyData = false;

function askQuestion() {
	//Textbox and submit question button should appear when user clicks on "I have a question."
	document.getElementById("questionArea").style.visibility = "visible";
}

function submitQuestion() {
	//Print the question user types in out to console. 
	var question = document.getElementById("questionField").value; 
	console.log(question);
}

function addPizzazz() {
	//add pizzazz to the saying of the day. i changed the font, color, & size of the quote. 
	document.getElementsByName("sayingOfTheDay")[0].style.font = "italic bold 55px arial,sans-serif";
	 document.getElementsByName("sayingOfTheDay")[0].style.color = "purple";

}

function saveBalance() {
	//if balanceInput is valid assign that value to balance
	var numbers = /^[+-]?([0-9]*[.])?[0-9]+$/; //regex to check for valid money value

	if(balanceInput.value.match(numbers)){
		document.getElementById("balance").innerHTML = balanceInput.value; 
	}
	else{
		console.log("Cannot update balance, syntax error! ");
	}
}

function printBalance() {
	var printStatement = "You have " + document.getElementById("balance").innerHTML + " in your account!"; 
	console.log(printStatement);
}

function alertBalance() {
	var currentBalance = document.getElementById("balance").innerHTML; 
	if(currentBalance < 0 ){
		alert(":("); 
	}
	else if(currentBalance <= 100){
		alert(":)"); 
	}
	else{
		alert(":D"); 
	}
}

function loadFriendsAndFamilyData() {

	if (hasLoadedFriendsAndFamilyData) {
		return;
	} else {
		hasLoadedFriendsAndFamilyData = true;
	}

	let friendsAndFamilyAccounts = [
		{
			name: "Jane McCain",
			balance: 7262.71
		},
		{
			name: "Bill Phil",
			balance: 9830.02
		},
		{
			name: "Tod Cod",
			balance: 0.03
		},
		{
			name: "Karen Marin",
			balance: 72681.01
		}
	];

	for( i = 0; i < friendsAndFamilyAccounts.length; i++){

		currName = friendsAndFamilyAccounts[i].name; 
		currBal = friendsAndFamilyAccounts[i].balance; 
		let table = document.getElementById("friendsAndFamilyBalances"); 
		let newRow = table.insertRow(i + 1); 
		let cell1 = newRow.insertCell(0); 
		let cell2 = newRow.insertCell(1); 
		cell1.innerHTML = currName;
		cell2.innerHTML = currBal;

		if(currBal < 1){
			var rowSelected = table.getElementsByTagName('tr')[i + 1];
			rowSelected.style.backgroundColor = "red";
		}

	}

}

function addPersonalTransactionRows() {
	
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest()

	// Open a new connection, using the GET request on the URL endpoint
	request.open('GET', 'http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transactions?amount=4', true)

	request.onload = function () {
			// Begin accessing JSON data here
			var data = JSON.parse(this.response)
			data.forEach((transaction) => {

				// Log each transaction's company (just to make sure this get request worked!)
				// console.log(transaction.company)
				// console.log(transaction.date)
				// console.log(transaction.amount)

				//Add this transaction to the table...
				var x =document.getElementById('personalTransactions').insertRow(1);
				let cell1 = x.insertCell(0); 
				let cell2 = x.insertCell(1); 
				let cell3 = x.insertCell(2); 
				cell1.innerHTML = transaction.date;
				cell2.innerHTML = transaction.company;
				cell3.innerHTML = transaction.amount;

			})
	}

	// Send request
	request.send()

}

function clearPersonalTransactionRows() {
	var ctr = 1; 
	//grab the table from DOM 
	var table = document.getElementById('personalTransactions');
	var rowCount = table.rows.length;
	//iterated through the table and delete each row!
	for (var i = ctr; i < rowCount; i++) {
		table.deleteRow(ctr);
	}

}
