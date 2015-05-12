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
var lexicalTable = [];
var symbolTable = [];

window.onload = function() {
	var uploadButton = document.getElementById('uploadButton');

	uploadButton.addEventListener('click', function(e) {
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
				if(tokens[j].length) {
					tokens[j] = tokens[j].trim();
					mappedInstruction = mappedInstruction + opcodeMap[tokens[j]] + " ";
				}
			}

			convertedInstructions.push(mappedInstruction);
		}
		
		for(var i = 0; i<lineTokens.length; i++) {
			$("table#syntaxMachineCodeTable").append('<tr><td>' + lineTokens[i] + '</td><td>' + convertedInstructions[i] + '</td></tr>');
		}	
		

		lexicalAnalysis();
	}

	function lexicalAnalysis() {
		// regular expressions for pattern matching of entered instruction codes

		// data transfer instruction
		var ld_regex =  /^(LD)\s+(R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1)$/;
		var str_regex = /^(STR)\s+(MAR0|MAR1)\s+(R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var sv_regex =  /^(SV)\s+(R0|R1|R2|R3|R4|R5|R6|R7)\s+(R0|R1|R2|R3|R4|R5|R6|R7|MAR0|MAR1|\d+)$/;
		
		// arithmetic instructions
		var inc_regex = /^(INC)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var dec_regex = /^(DEC)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var add_regex = /^(ADD)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var sub_regex = /^(SUB)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var mul_regex = /^(MUL)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var div_regex = /^(DIV)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;

		// comparison operation
		var cmp_regex = /^(CMP)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;

		// logic instructions
		var and_regex = /^(AND)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var or_regex =  /^(OR)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var not_regex = /^(NOT)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;
		var xor_regex = /^(XOR)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)\s+(MAR0|MAR1|R0|R1|R2|R3|R4|R5|R6|R7)$/;

		// program flow instruction
		var je_regex =  /^(JE)\s+(MAR0|MAR1)$/;
		var jg_regex =  /^(JG)\s+(MAR0|MAR1)$/;
		var jl_regex =  /^(JL)\s+(MAR0|MAR1)$/;
		var jmp_regex = /^(JMP)\s+(MAR0|MAR1)$/;

		for(var i = 0; i<lineTokens.length; i++) {
			if(lineTokens.length) {
				// LOAD
				if(ld_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(ld_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "LOAD INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// STORE
				else if(str_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(str_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "STORE INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// SAVE
				else if(sv_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(sv_regex);
					var data = [];

					data['instruction'] = match[1];
					data['description'] = "SAVE INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// INCREMENT
				else if(inc_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(inc_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "INCREMENT INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// DECREMENT
				else if(dec_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(dec_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "DECREMENT INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// ADDITION
				else if(add_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(add_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "ADDITION INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// DIVISION
				else if(sub_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(sub_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "DIVISION INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// MULTIPLICATION
				else if(mul_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(mul_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "MULTIPLICATION INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// DIVISION
				else if(div_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(div_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "DIVISION INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// COMPARE
				else if(cmp_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(cmp_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "COMPARE INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// AND
				else if(and_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(and_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "AND INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// OR
				else if(or_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(or_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "OR INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// NOT
				else if(not_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(not_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "NOT INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// XOR
				else if(xor_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(xor_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "XOR INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
					classifyLexemes(match[3]);
				}

				// JUMP EQUAL
				else if(je_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(je_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "JUMP EQUAL INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
				}

				// JUMP GREATER THAN
				else if(jg_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(jg_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "JUMP GREATER THAN INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
				}

				// JUMP LESS THAN
				else if(jl_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(jl_regex);

					var data = [];

					data['instruction'] = match[1];
					data['description'] = "JUMP LESS THAN INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
				}			

				// JUMP
				else if(jmp_regex.test(lineTokens[i])) {
					var match = lineTokens[i].match(jmp_regex);
					var data = [];

					data['instruction'] = match[1];
					data['description'] = "JUMP INSTRUCTION";

					lexicalTable.push(data);

					classifyLexemes(match[2]);
				}			

				else {
					alert("Error: Invalid Instruction Code.");
					alert(lineTokens[i]);
				}
			}
		}

		//printArray(lexicalTable);
	}

	function classifyLexemes(lexemes) {
		var register_regex = /(R0|R1|R2|R3|R4|R5|R6|R7)/;
		var memoryaddress_regex = /(MAR0|MAR1)/;
		var data = [];

		data['instruction'] = lexemes;

		if(register_regex.test(lexemes)) data['description'] = "GENERAL PURPOSE REGISTER";
		else if(memoryaddress_regex.test(lexemes)) data['description'] = "MEMORY ADDRESS REGISTER";
		else if(/\d+/.test(lexemes)) data['description'] = "NUMBER LITERAL";

		lexicalTable.push(data);
	}

	/****************************************/
	function printArray(array) {
		for(var i = 0; i<lexicalTable.length; i++) {
			alert(lexicalTable[i]['instruction'] + "   " + lexicalTable[i]['description']);
		}
	}
	/****************************************/
}
