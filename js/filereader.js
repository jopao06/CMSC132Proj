var opcodeMap = {
	"LD"	:	"00000001",	
	"STR"	:	"00000010",	
	"SV"	:	"00000011",	
	"INC"	:	"00000100",	
	"DEC"	:	"00000101",	
	"ADD"	:	"00000110",	
	"SUB"	:	"00000111",	
	"MUL"	:	"00001000",	
	"DIV"	:	"00001001",	
	"CMP"	:	"00001010",	
	"AND"	:	"00001011",	
	"OR"	:	"00001100",	
	"NOT"	:	"00001101",	
	"XOR"	:	"00001110",	
	"JE"	:	"00001111",	
	"JG"	:	"00010000",	
	"JL"	:	"00010001",	
	"JMP"	:	"00010010",	
	"MAR0"	:	"00000001",	
	"MAR1"	:	"00000010",	
	"R0"	:	"00000011",	
	"R1"	:	"00000100",	
	"R2"	:	"00000101",	
	"R3"	:	"00000110",	
	"R4"	:	"00000111",	
	"R5"	:	"00001000",	
	"R6"	:	"00001001",	
	"R7"	:	"00001010"
};

var lineTokens;
var convertedInstructions;
var lexemes;
var symbolTable;


window.onload = function() {
	var uploadForm = document.getElementById('uploadForm');
	var inputFile = document.getElementById('inputFile');
	// var convertedFileData = document.getElementById('convertedFileData');

	uploadForm.addEventListener('submit', function(e) {
		var file = inputFile.files[0];
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				parseData(reader.result);
			}

			reader.readAsText(file);	

		} else {
			fileData.innerText = "File not supported!";
		}
	});

	// this function parses the data given but the user
	function parseData(data)  {
		lineTokens = data.split("\n");
		convertedInstructions = [];

		for(var i = 0; i<lineTokens.length; i++) {
			lineTokens[i] = lineTokens[i].trim();
			lineTokens[i] = lineTokens[i].toUpperCase();

			var tokens = lineTokens[i].split(" ");
			var mappedInstruction = "";

			for(var j = 0; j<tokens.length; j++) {
				tokens[j] = tokens[j].trim();
				mappedInstruction = mappedInstruction + opcodeMap[tokens[j]];
			}

			convertedInstructions.push(mappedInstruction);
		}
		
		// Displays Data
				
		// var displayData = "";
		// var displayDataMappedOpcode = "";

		// for(var i = 0; i<lineTokens.length; i++) {
		// 	lineTokens[i] = lineTokens[i].trim();
		// 	displayData += lineTokens[i] + "\n";
		// 	displayDataMappedOpcode += convertedInstructions[i] + "\n";
		// }	

		// var fileData = document.getElementById('fileData');
		// fileData.innerText = displayData;
		// // convertedFileData.innerText = displayDataMappedOpcode;
		

		// lexicalAnalysis();
	}

	function lexicalAnalysis() {
		// regular expressions for pattern matching of entered instruction codes
		var ld_regex = /^(LD)\s+(R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1)$/;
		var str_regex = /^(STR)\s+(MAR0|MAR1)\s+(R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var sv_regex = /^(SV)\s+(R0|R1|R2|R3|R4|R5|R6|R7)\s+(R0|R1|R2|R3|R4|R5|R6|R7|MAR0|MAR1|\d+)$/;
		
		var inc_regex = /^(INC)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var add_regex = /^(ADD)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;


		for(var i = 0; i<lineTokens.length; i++) {
			// LOAD
			if(ld_regex.test(lineTokens[i])) {
				var match = lineTokens[i].match(ld_regex);
			}

			// STORE
			else if(str_regex.test(lineTokens[i])) {
				var match = lineTokens[i].match(str_regex);
			}

			// SAVE
			else if(sv_regex.test(lineTokens[i])) {
				var match = lineTokens[i].match(sv_regex);
				alert(match);
			}

			else if(inc_regex.test(lineTokens[i])) {
				var match = lineTokens[i].match(ld_regex);
			}

			else if(add_regex.test(lineTokens[i])) {
				var match = lineTokens[i].match(ld_regex);
			}

			else {
				alert("Error: Invalid Instruction Code.");
			}
		}
	}


}
