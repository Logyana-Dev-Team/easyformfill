function printForm() {
    index();
   
    // namuna12m();
    // namunae();
    // photoformat();
    // prapatrab();
}


// function PrintAll() {
//   var pages =  ["http://localhost:8080/wireman-photo", "http://localhost:8080/wireman-index", "http://localhost:8080/wireman-letter"];

  
//   var printNext = function(i) {
//     i = i || 0;
//     if (i >= pages.length) {
//       return;
//     }

//     var wdw = window.open(pages[i], 'print');
//     wdw.onload = function() {
//       wdw.print();

//       wdw.close();
//       setTimeout(function() { 
//         printNext(++i);
//       }, 100);

//     }
//   };

//   printNext();
// }

// // setTimeout(function() {
// //   alert("Count = " + count);
// // }, 1000 * count);


function index(){
  console.log('index')
  w=window.open("http://localhost:8080/wireman-index");
        w.window.print();
        w.window.close();
        // letter();

  // var location = window.location.href;
  //       console.log(window.location.href);
  //     window.print();
  //     return false;
}

function letter(){
  console.log('letter')
  w=window.open("http://localhost:8080/wireman-letter");
        w.window.print();
        w.window.close();

  // var location = window.location.href;
  //       console.log(window.location.href);
  //     window.print();
  //     return false;
}
// function photoformat(){
//   w=window.open("http://localhost:8080/wireman-letter");
//         w.window.print();
//         w.window.close();

//   // console.log('photoformat')
//   // var location = window.location.href;
//   //       console.log(window.location.href);
//   //     window.print();
//   //     return false;
// }


// function namuna12m(){
//   console.log('namuna12m')
//     var location = window.location.href;
//         console.log(window.location.href);
//       window.print();
//       return false;
// }

// function namunae(){
//   console.log('namunae')
//     var location = window.location.href;
//     console.log(window.location.href);
//       window.print();
//       return false;
// }

