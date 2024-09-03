const keyword_extractor = require("keyword-extractor");
const rake = require('rake-js');

var openai = require("./openaifunctionality.js");

module.exports = function(data, isRake, useOpenAI) {
	
	if(useOpenAI){
		return openai("Can you rephrase the following sentence without negations and can you extract the functional and non-functional requirements of the text and write them in two arrays, one array for functional requirements and one for non-functional requirements \n"+
			+ "the individual requirements should be separated by commas. The format for the response should be json: "+ data.input).then((resolve) => {
			console.log("resolve");
			console.log(resolve);
			return matching(data, isRake, resolve.choices[0].message.content, useOpenAI);
		});
	
	}else{
		return matching(data, isRake, data.input, useOpenAI);
	}
	
}
	
	function matching(data, isRake, resultvalue, isRephrased){
		
		var infos = data.algodata;

		console.log("The infos");
		console.log(infos)
		var datainput = resultvalue;
		console.log("input:");
	    console.log(data.input);
		
		if(isRephrased){
			console.log("rephrasedInput:");
			console.log(datainput);
		}
	
		var allkeywords = [];
		var results = [];
		infos.forEach(algorithminfo => {
		
			if(isRake){
				const intentkeywords2 = rake.default(algorithminfo.data.intent, { language: 'english' });
				const problemkeywords2 = rake.default(algorithminfo.data.problem, { language: 'english' });
				const solutionkeywords2 = rake.default(algorithminfo.data.solution, { language: 'english' });

				let intentkeywords = [];
				let problemkeywords = [];
				let solutionkeywords = [];
				intentkeywords2.forEach(words => {
					intentkeywords = intentkeywords.concat(words.split(' '));
				});
				problemkeywords2.forEach(words => {
					problemkeywords = intentkeywords.concat(words.split(' '));
				});
				solutionkeywords2.forEach(words => {
					solutionkeywords = intentkeywords.concat(words.split(' '));
				});
				
				//quadruple value
				var applicationareaskeywords = []; 
				var problemtypeskeywords = [];
				if (algorithminfo.data.applicationAreas && algorithminfo.data.applicationAreas.length > 0) {
					algorithminfo.data.applicationAreas.forEach(word => {
						applicationareaskeywords.push(word.label);
						applicationareaskeywords.push(word.label);
						applicationareaskeywords.push(word.label);
						applicationareaskeywords.push(word.label);
					});
				}
				
			
				allkeywords.push({name: algorithminfo.name, 
			                  keywords: intentkeywords.concat(intentkeywords).concat(problemkeywords, solutionkeywords)
							            .concat(applicationareaskeywords, problemtypeskeywords)
				});
					
			}else{
				console.log("Bbbbb")
				console.log(algorithminfo.data)
				const intentkeywords =[];
				const problemkeywords =[];
				const solutionkeywords = [];
			/** 
				const intentkeywords = keyword_extractor.extract(algorithminfo.data.intent,{
			    language:"english",
			    remove_digits: true,
			    return_changed_case:true,
			    remove_duplicates: false
		    });
				const problemkeywords = keyword_extractor.extract(algorithminfo.data.problem,{
			    language:"english",
			    remove_digits: true,
			    return_changed_case:true,
			    remove_duplicates: false
		    });
				const solutionkeywords = keyword_extractor.extract(algorithminfo.datasolution,{
			    language:"english",
			    remove_digits: true,
			    return_changed_case:true,
			    remove_duplicates: false
		    });
			*/
			//quadruple value
			var applicationareaskeywords = []; 
			var problemtypeskeywords = [];
			
			console.log("appli")
			console.log(algorithminfo.data.applicationAreas);
			if (algorithminfo.data.applicationAreas && algorithminfo.data.applicationAreas.length > 0) {
				algorithminfo.data.applicationAreas.forEach(word => {
					console.log("applicationwwhw")
					console.log(word)
					applicationareaskeywords.push(word.split(" ")[0]);
				});
			}
			
			
			allkeywords.push({name: algorithminfo.name, 
			                  keywords: intentkeywords.concat(intentkeywords).concat(problemkeywords, solutionkeywords)
							            .concat(applicationareaskeywords, problemtypeskeywords)});
			}

			console.log("key words");
			console.log(allkeywords)
			
		});
		
		allkeywords.forEach(algo => {
			const occurrences = algo.keywords.reduce(function (acc, curr) {
			return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc}, {});
			results.push({name: algo.name, occurrences: occurrences});
		});

		var extraction_result_input = [];
		var similarities = [];
		
		if(isRake){
			extraction_result_input2 = rake.default(datainput, { language: 'english' });
			extraction_result_input2.forEach(words => {
				extraction_result_input = extraction_result_input.concat(words.split(' '));
			});
			
			console.log("input keywords");
			console.log(extraction_result_input);
			console.log(results)
		}else{
			extraction_result_input =
	        keyword_extractor.extract(datainput,{
			    language:"english",
			    remove_digits: true,
			    return_changed_case:true,
			    remove_duplicates: false
		    });
			console.log("input keywords");
			console.log(extraction_result_input);
			console.log(results)
		}
			
		// cosine similarity with keywords
		var sim = [];
		results.forEach(alg => {
			sim.push({name: alg.name, cosineSimilarity: textCosineSimilarity(alg.name, alg.occurrences, extraction_result_input)});
		});
		sim.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);
		console.log("result");
		console.log(sim);
		
		if(isRephrased){
			return {result: sim, rephrasedInput: datainput}
		}else{
			return {result: sim}
		}
		
	}
    
	//-------------------------------------------------------------------------------------------- 
	// https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
	//--------------------------------------------------------------------------------------------
	
	
	function termFreqMap(array) {
        var termFreq = {};
        array.forEach(function(w) {
            termFreq[w] = (termFreq[w] || 0) + 1;
        });
        return termFreq;
    }

    function addKeysToDict(map, dict) {
        for (var key in map) {
            dict[key] = true;
        }
    }

    function termFreqMapToVector(map, dict) {
        var termFreqVector = [];
        for (var term in dict) {
			console.log(term)
            termFreqVector.push(map[term] || 0);
        }
		console.log("vector A")
		console.log(termFreqVector)
        return termFreqVector;
    }

    function vecDotProduct(vecA, vecB) {
        var product = 0;
        for (var i = 0; i < vecA.length; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    }

    function vecMagnitude(vec) {
        var sum = 0;
        for (var i = 0; i < vec.length; i++) {
			//console.log(vec[i])
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }

    function cosineSimilarity(vecA, vecB) {
		console.log("cosine similarity");
		console.log(vecDotProduct(vecA, vecB));
		console.log(vecMagnitude(vecA));
		console.log((vecMagnitude(vecB)))
        return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
    }

	

	function textCosineSimilarity(name, occurences, input) {
		console.log("compute cs");
		console.log(name);
        var termFreqB = termFreqMap(input);

        var dict = {};
        //addKeysToDict(occurences, dict);
        addKeysToDict(termFreqB, dict);

        var termFreqVecA = termFreqMapToVector(occurences, dict);
        var termFreqVecB = termFreqMapToVector(termFreqB, dict);

        return cosineSimilarity(termFreqVecA, termFreqVecB);
    }	
