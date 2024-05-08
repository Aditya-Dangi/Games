let score= JSON.parse(localStorage.getItem('score'));  //parse to convert the STRING json'score' to OBJECT ;
    
    if(score===null)
    {
      score={
        Wins:0,
        Loses:0,
        Ties:0
      };
    }

    let computerMove='';
    function computerfunction()
    {
      let computer=Math.random();
      if(computer>=0 && computer<1/3)
      {
        computerMove='Stone';
      }
      else if(computer>=1/3 && computer<2/3)
      {
        computerMove='Paper';
      }
      else
      {
        computerMove='Scissors';
      }

      return computerMove;
    }

    function startGame(moveName)
    {
      let computermove=computerfunction();
      let result='';

      if(moveName==='Stone')
      {
        if(computermove==='Stone')
        {
          result='Tie';
        }
        else if(computermove==='Paper')
        {
          result='You Lose';
        }
        else
        {
          result='You Win';
        }
      }
      else if(moveName==='Paper')
      {
        if(computermove==='Stone')
        {
          result='You Win';
        }
        else if(computermove==='Paper')
        {
          result='Tie';
        }
        else
        {
          result='You Lose';
        }
      }
      else
      {
        if(computermove==='Stone')
        {
          result='You Lose';
        }
        else if(computermove==='Paper')
        {
          result='You Win';
        }
        else
        {
          result='Tie';
        }
      }

      if(result==='You Win')
      {
        score.Wins++;
      }
      else if(result==='You Lose')
      {
        score.Loses++;
      }
      else
      {
        score.Ties++;
      }
      localStorage.setItem('score', JSON.stringify(score));   //js objcet conerted to json string and then ready to be stored in local storage as local storage only accepts STRING
      
      document.querySelector('.scoremove')
        .innerHTML=`You  <img src="${moveName}.jpg" alt="${moveName}">  \t\t\t  <img src="${computerMove}.jpg" alt="${computerMove}"> Computer`;
        
      document.querySelector('.scoreresult')
        .innerHTML=`${result}`;

      updatescore();

    }
    
    function updatescore()
    {
      document.querySelector('.scoreupdate')
        .innerHTML=`Wins: ${score.Wins} Losses: ${score.Loses} Ties: ${score.Ties}`;
    }

    updatescore();