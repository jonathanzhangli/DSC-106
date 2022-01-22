function assignment1(){ 
    //Use this function to call solution functions of other questions 
    //arrays to be used in the functions should also be initialized and declared in this function
    // question1();
    // question2(15);
}  

question1=function(){
    //This function prints the pattern mentioned in Question 2
    document.write("WELCOME TO DSC 106");
}

question2=function(n){
    //This function prints the pattern mentioned in Question 2
    for (let i = 0; i < n; i++) {
        document.write("*");
    }
}

question3=function(n){
    //This function prints the pattern mentioned in Question 3
    for (let i = 0; i < n; i++) {
        document.write("*#");
    }
    document.write("*");
}

question4=function(n){
    //This function prints the pattern mentioned in Question 4
    for (let i = 0; i < n; i++) {
        document.write("*");
        document.write("<br>")
    }
}

question5=function(n){
    //This function prints the pattern mentioned in Question 5
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            document.write("*");
        }
        document.write("<br>");
    }
}

question6=function(n){
    //This function prints the pattern mentioned in Question 6
    for (let i = 0; i < n; i++) {
        for (let j = n - i; j < n + 1; j++) {
            document.write("*");
        }
        document.write("<br>");
    }
}

question7=function(n){
    //This function prints the pattern mentioned in Question 7
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < 2 * (n - i); k++) {
            document.write('&nbsp;');
        }
        for (let j = 0; j < i * 2 + 1; j++) {
            document.write("*");
        }
        document.write("<br>");
    }
}

q8binomialCoeff=function(n,k){
    let res = 1;
    if (k > n - k) {
        k = n - k
    }
    for (let i = 0; i < k; i++) {
        res = res * (n - i)
        res = res // (i + 1)
    }
    return res
}

question8=function(n){
    //This function prints the pattern (Pascals Triangle) mentioned in Question 8
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < 2 * (n - i); k++) {
            document.write('&nbsp;');
        }
        for (let j = 0; j < i + 1; j++) {
            document.write(q8binomialCoeff(i, j))
            document.write('&nbsp;');
            document.write('&nbsp;');
        }
        document.write("<br>");
    }
}

question9=function(arr1){
    //This function sorts arr1 and returns the median of the sorted array
    arr1.sort()
    if (arr1.length % 2 == 0) {
        let med1 = arr1[arr1.length / 2 - 1];
        let med2 = arr1[arr1.length / 2];
        document.write((med1 + med2) / 2);
    } else {
        document.write(arr1[Math.floor(arr1.length / 2)])
    }
}

question10_1=function(arr){
    //This function normalizes values of array arr 
    let ratio = Math.max.apply(Math, arr) / 1;

    for (let i = 0; i < arr.length; i++) {
        new_val = arr[i] / ratio;
        arr[i] = new_val;
    }
    document.write(arr);
}

question10_2=function(arr){
    //This function calculates mean of all the values in array arr
    const average = (arr) => arr.reduce((a, b) => a + b) / arr.length;
    document.write(average(arr));
}

question10_3=function(arr){
    //This function calculates variance of all the values in array arr
    const average = (arr) => arr.reduce((a, b) => a + b) / arr.length;
    mean = average(arr);
    let variance = 0;
    for (let i = 0; i < arr.length; i++) {
        variance += (arr[i] - mean) * (arr[i] - mean);
        // document.write((arr[i] - mean) * (arr[i] - mean))
    }
    variance = variance / (arr.length - 1);
    document.write(variance);
}
question10_4=function(arr1,arr2){
    //This function performs element-wise multiplication of all the values in array arr
    ans = [];
    for (let i = 0; i < arr1.length; i++) {
        ans.push(arr1[i] * arr2[i]);
    }
    document.write(ans);
}

