const resultElemenet = document.getElementById("result");
const pokemonImageElemenet = document.getElementById("pokemonImage");
const pointsElement = document.getElementById("pointsValue");
const optionsContainer = document.getElementById("options");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementById("container");
const loadingContainer = document.getElementById("loadingContainer");

//initialize variables
let usedPokemonIds = [];
let count = 0; //15.3)
let points = 0; //15.8)
let showLoading = false;


//2)create a function to fetch one pokemon with the id
async function fetchPokemonById(id){
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

// //3) create a test function to see result of step 2
// async function testFetch(){
//     const pokemon = await fetchPokemonById();
//     console.log(pokemon);
// }

// //4)call the test function
// testFetch();

//6)function to load questions with options
async function loadQuestionsWithOptions(){

    if(showLoading){
        showLoadingWindow();
        hidePuzzleWindow();
    }
    //7)fetch the correct anwer
    let pokemonId = getRandomPokemonId();

    //8.2) check if current question has already been used
    while(usedPokemonIds.includes(pokemonId)){
        pokemonId = getRandomPokemonId();
    }
    
    //8.3)if pokemon hasnt been displayed yet, it is added to usedPokemoIds and its set as a new const pokemon
    const pokemon = await fetchPokemonById(pokemonId);

    //9) create options array
    const options = [pokemon.name];
    const optionsIds = [pokemon.id];

    //10) fetch additiol pokemon names (wrong answers) for options
    while(options.length < 4){
        let randomPokemonId = getRandomPokemonId();
        //10.1)Ensure the fetched option doesnt exist in the options list
        while(optionsIds.includes(randomPokemonId)){
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        //10.2) fetch pokemon by the newly made ID. adding it to the options array
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        //10.3) test
        console.log(options);
        console.log(optionsIds);
       //16.5 turn off loading if all options fetched
        if(options.length === 4){
            showLoading = false;
        }
    }

    shuffleArray(options);

    //13)clear any previous reuslt and update pokemon image
    resultElemenet.textContent = "Who's that Pokemon?";
    pokemonImageElemenet.src =  pokemon.sprites.other.dream_world.front_default;

    //14) create options html element from options array in DOM
    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name,event);
        optionsContainer.appendChild(button);
    });

    if(!showLoading){
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

//11)initial load
loadQuestionsWithOptions();

//15)create Check answer function
function checkAnswer(isCorrect,event){
    //15.1)checks any button  already selected is falsy => no element => null
   const selectedButton = document.querySelector(".selected");

   //15.2)if already a button a selected do nothing
   if(selectedButton){
    return;
   }

   //15.4) Else marked the clicked button as selected and increase the count by 1,
   event.target.classList.add("selected");
   count++;
   totalCount.textContent = count;
   //15.7 call displayedResult
   if(isCorrect){
      displayedResult("You guessed it right!");
      //15.8 if correct increase the points by one
      points++;
      pointsElement.textContent = points;
      event.target.classList.add("correct");
   }
   else{
    displayedResult("Wrong answer");
    event.target.classList.add("wrong");
   }

   //15.9) Load the next question with a 1 second delay
   setTimeout(() => {
     showLoading = true;
     loadQuestionsWithOptions();
   }, 1000);

}

//--UTILITY FUNCTIONS--
//5)function to randomize pokemon id 
function getRandomPokemonId(){
    return Math.floor(Math.random() * 151) + 1;
}

//12.1)shuffle the array we send it 
function shuffleArray(array){
   return array.sort(() => Math.random() - 0.5);

}

//15.5) Function to update result text and class name
function displayedResult(result){
   resultElemenet.textContent = result;
}

//17) hide loading
function hideLoadingWindow(){
    loadingContainer.classList.add('hide');
}

//18)showLoading
function showLoadingWindow(){
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove('hide');
    loadingContainer.classList.add('show');
}

//19)showPuzzleWindow
function showPuzzleWindow(){
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

//20) hidePuzzleWindow
function hidePuzzleWindow(){
  mainContainer[0].classList.add("hide");
}