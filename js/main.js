$(function () {


    $('.heading-4__current').hide();
    $('.song').css({'visibility':'hidden'});



    var i = 1,isChanged;

    var src_arr = [
        'unforgettable_bg.jpg',
        'feels_bg.jpg',
        'drake_bg.jpg',
        'gotye_bg.jpg',
        'dev-d_bg.jpg'
    ];


    var canvas,ctx,analyser;
    canvas = document.getElementById("visualizer");
    canvas.width = $('.container').width();
    canvas.height = $('.container').height();

    audioContext = new AudioContext();

    paused = true;
    var arr = $('.spinner-wrap').siblings('audio');
    console.log(arr);

    console.log(arr.length);


    function setupWebAudio() {
        console.log("SetupAudio function");
        index_analyzer = $('.spinner-wrap').attr("id");
        song_div = arr[index_analyzer];


        audio = new Audio();
        audio.src = song_div.firstElementChild.getAttribute("src");
        console.log(song_div.firstElementChild.getAttribute("src"));


        console.log(audio);


        analyser = audioContext.createAnalyser();
        var source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

    }

    function draw() {

        window.requestAnimationFrame(draw);
        var freqByteData = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteFrequencyData(freqByteData);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        var barHeight;

        for(var i=1; i < freqByteData.length; i += 12){

            var red = Math.random()*255 >> 0,
                green = Math.random()*255 >> 0,
                blue = Math.random()*255 >> 0;

            barHeight = freqByteData[i]/3;

            ctx.fillStyle = 'rgb('+ (barHeight+155) +','+50+',50)';
            ctx.fillRect(i*1.1,canvas.height - freqByteData[i],8,canvas.height);
            ctx.strokeRect(i*1.1,canvas.height - freqByteData[i],8,canvas.height);
        }
    }



    function pulsing(pulse) {

        $('.spinner-wrap').addClass('pulse');

        setTimeout(function () {
            $('.spinner-wrap').removeClass('pulse');
        }, pulse-100)
    }

    function playAudio(index) {
        $('.heading-4__default').remove();
        $('.heading-4__current').show();
        $('.song').css({'visibility':'visible'});

        if(isChanged){
            var src = src_arr[index];
            $('.bg')
                .animate({opacity: 0.2},'slow',function() {
                    $(this)
                        .css({'background-image': 'linear-gradient(to right bottom, rgba(255, 80, 70, 0.53),rgba(255, 128, 130, 0.57) ),url("../img/'+src+'")',
                            'background-size' : 'cover',
                            'background-position' : 'top'
                        })
                        .animate({opacity: 1});
                });
        }

        ctx = canvas.getContext('2d');
        setupWebAudio();
        audio.play();
        //arr[index].play();
        draw();

        var name = arr[index].dataset.name;
        $('.current_song').text(name);
        console.log(index);

        if((index*1)===arr.length-1){
            var next_song = arr[0].dataset.name;
            $('.next_song').text(next_song);
        }
        else {
            var next_song = arr[index*1+1].dataset.name;
            $('.next_song').text(next_song);
        }

        var bpm = arr[index].dataset.bpm;
        var pulse = (60/bpm)*1000;
        $('.spinner-wrap').addClass('playing');
        pulsing(pulse);
        intervals = setInterval(function () {
            pulsing(pulse);
        }, pulse);

        audio.addEventListener('ended', function () {
            console.log("Song ended");
            $('.spinner-wrap').removeClass('playing');
            clearInterval(intervals);

            if((index*1)===(arr.length-1)){
                console.log("LAST SONG!!");
                indx = 0;
                $('.spinner-wrap').attr("id",indx);
                audio.src = song_div.firstElementChild.getAttribute("src");
                isChanged = true;
                playAudio(indx);
            }
            else{
                indx = index*1 + 1;
                $('.spinner-wrap').attr("id",indx);
                audio.src = song_div.firstElementChild.getAttribute("src");
                isChanged = true;
                playAudio(indx);
            }

        });

    }

    function pauseAudio(index) {
        audio.pause();
        arr[index].pause();
        arr[index].currentTime = 0;
        paused = true;
        $('.spinner-wrap').removeClass('playing');
        clearInterval(intervals);
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    function skipAudio(index,paused) {
        if(!paused){
            pauseAudio(index);
        }
        console.log("index params skip fn = "+index);

        if(index*1===arr.length-1){
            var Ind = 0;
            var next_song = arr[1].dataset.name;
            $('.next_song').text(next_song);

        }
        else if(index*1===arr.length-2){
            var Ind = index*1+1;
            var next_song = arr[0].dataset.name;
            $('.next_song').text(next_song);
        }
        else{
            var Ind = index*1+1;
            var next_song = arr[Ind+1].dataset.name;
            $('.next_song').text(next_song);

        }

        console.log(Ind);

        var name = arr[Ind].dataset.name;
        $('.current_song').text(name);


        $('.spinner-wrap').attr("id",Ind);
        isChanged = true;

    }

    $('.spinner-wrap').click(function () {

        var $this = $(this);

        var index = $this.attr("id");
        if(paused){
            paused = false;
            if($('.bg').hasClass("default")){
                $('.bg')
                    .animate({opacity: 0.2},'slow',function() {
                        $(this)
                            .css({'background-image': 'linear-gradient(to right bottom, rgba(255, 80, 70, 0.53),rgba(255, 128, 130, 0.57) ),url("../img/unforgettable_bg.jpg")',
                                'background-size' : 'cover',
                                'background-position' : 'top'
                            })
                            .animate({opacity: 1});
                    });
                $('.bg').removeClass("default");
            }
            else{
                if(isChanged){
                    var src = src_arr[index];
                    $('.bg')
                        .animate({opacity: 0.2},'slow',function() {
                            $(this)
                                .css({'background-image': 'linear-gradient(to right bottom, rgba(255, 80, 70, 0.53),rgba(255, 128, 130, 0.57) ),url("../img/'+src+'")',
                                    'background-size' : 'cover',
                                    'background-position' : 'top'
                                })
                                .animate({opacity: 1});
                        });
                }

            }
            playAudio(index);
        }
        else{
            isChanged = false;
            pauseAudio(index);
        }
    });

    $('#btn-skip').click(function () {
        var index = $('.spinner-wrap').attr("id");
        skipAudio(index,paused);
    });


});