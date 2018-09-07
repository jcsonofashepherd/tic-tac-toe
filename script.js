$(document).ready(function() {
  
  //  Represents player / computer icon, turn count, scores, button values, and app state, as well as victory condition variables
  let player = '',
      cpu = '',
      turn = 0,
      playerScore = 0,
      cpuScore = 0,
      buttonIndex = ['#zero', '#one', '#two',
                     '#three', '#four', '#five',
                     '#six', '#seven', '#eight'],
      lines = [[0, 0, 1, 2],
               [0, 3, 4, 5],
               [0, 6, 7, 8],
               [0, 0, 3, 6],
               [0, 1, 4, 7],
               [0, 2, 5, 8],
               [0, 0, 4, 8],
               [0, 2, 4, 6]],
      grid = [0, 0, 0,
              0, 0, 0,
              0, 0, 0],
      gameOn = true,
      cpuTurn = false;
  
  //  Resets the board tiles and number of turns
  const resetBoard = () => {
    turn = 0;
    
    for (let i = 0; i < 9; i++) {
      grid[i] = 0;
      $(buttonIndex[i]).val('0').text('');
    }
  }
  
  //  Checks the sum of horizontal, vertical, and diagonal lines
  const checkLines = () => {
    for (let i = 0; i < 8; i++) {
      lines[i][0] = grid[lines[i][1]] + grid[lines[i][2]] + grid[lines[i][3]]; 
    }
  }
  
  //  Checks the state of the board
  const checkBoard = () => {
    let status = true;
    
    for (let i = 0; i < 9; i++) {
      grid[i] = Number($(buttonIndex[i]).val());
    }
    
    checkLines();
    
    for (let i = 0; i < 8; i++) {
      if (lines[i][0] > 2) {
        status = false;
        playerScore++;
        
        $('#Screen').css('background', '#00ccff');
        $('h3').text('Player won!');
        updateScreen();
        
      } else if (lines[i][0] < -2) {
        status = false;
        cpuScore++;
        
        $('#Screen').css('background', '#ff8080');
        $('h3').text('Computer won!');
        updateScreen();
      }
    }
    return status;
  }
  
  //  Occurs when a win, loss, or draw happens:  updates UI with result and score
  const updateScreen = () => {
    $('#Screen').fadeIn(1000);
    $('h1').hide();
    $('h4').show();
    $('#PlayerScore').text(playerScore);
    $('#ComputerScore').text(cpuScore);
  }
  
  //  If possible, computer does a random move, prioritizing the center first
  const randomMove = () => {
    if (grid[4] == 0) {
      $(buttonIndex[4]).val('-1').text(cpu);
    } else {
      while (true) {
        let spot = [Math.floor((Math.random() * 10))];
        
        if (grid[spot] == 0) {
          $(buttonIndex[spot]).val('-1').text(cpu);
          break;
        }
      }
    }
  }
  
  const setMove = (i, move) => {
    for (let j = 1; j < 4; j++) {
      if (grid[lines[i][j]] == 0) {
        $(buttonIndex[lines[i][j]]).val('-1').text(cpu);
        move = true;
        break;
      }
    }
    return move;
  }
  
  //  Checks the lines to see if computer or player might wins
  //  Prioritizes move based on possible win, then possible block, then random move
  const cpuMove = () => {
    let move = false;
    
    for (let i = 0; i < 8; i++) {
      if (lines[i][0] == -2) {
        move = setMove(i, move);
        break;
      }
    }
    
    if (!move) {
      for (let i = 0; i < 8; i++) {
        if (lines[i][0] == 2) {
          move = setMove(i, move);
          break;
        }
      }
    }
    
    if (!move) randomMove();
  }
  
  $('h1').on('click', function() {
    player = $(this).text();
    if (player == 'X') {
      cpu = $('#O').text();
    } else if (player == 'O') {
      cpu = $('#X').text(); 
    }
    $('#Screen').fadeOut();
  })
  
  $('#Reset').on('click', function() {
    playerScore = 0;
    cpuScore = 0;
    resetBoard();
    updateScreen();
    
    $('#Screen').css('background', '#ffffb3');
    $('h3').text('What do you want to play as?');
    $('h1').show();
    $('h4').hide();
  })
  
  $('h4').on('click', function() {
    resetBoard();
    
    $('#Screen').fadeOut();
  })
  
  $('.board').on('click', function() {
    let gameStatus = '';
    
    if ($(this).val() == '0') {
      $(this).val('1').text(player);
      turn++;
      
      $('#Screen').css('background', '#ffffb3');
      $('h3').text('Draw!');
      
      if (turn == 9) updateScreen();
      
      gameStatus = checkBoard();
      
      if (turn < 9 && gameStatus) {
        turn++;
        
        cpuMove();
        checkBoard();
      }
    }
  })
})
