$(function(){
			
			//handle list level
			$('#level li').click(function(event) {
				$('#level li').removeClass('active');
				$(this).addClass('active');
				window.location.href=$(this).find('a').attr('href');
			});


			var username=$('#username').html();
			if(username==''){
			$('#username').html('Login');
			$('#avatar').attr('src', '/image/ava.png');
			}
			else
			{
				$('#login').attr('href', '#');
			}

			$('#your').focus();

			//login form
			$('#login-nav').submit(function(e) {
				e.preventDefault();
				var URL=window.location.href;
				var files = $('#ava').get(0).files;	
	 			var name= $('#name').val();	 			
			    var formData = new FormData();
			    // loop through all the selected files
			    for (var i = 0; i < files.length; i++) {
			      var file = files[i];

			      // add the files to formData object for the data payload
			      formData.append('image', file, file.name);
			      formData.append('name',name);		     	
			    }
			    	
			     $.ajax({
				  url: '/login',
				  type: 'POST',
				  data: formData,
				  processData: false,
				  contentType: false,
				  success: function(data){
				 	
				  	$('#messLogin').html('Done').css('color','red');
				  		window.location.href=URL;  	
				  },
				  error:function(){
				  	console.log('error;');
				  }

				});
			});	  

			//function independent
			function isGreater(a,b)
			{	return Date.parse('01/01/2011 '+a) > Date.parse('01/01/2011 '+b)
				
			}
			function isEqual(a,b)
			{	return Date.parse('01/01/2011 '+a) == Date.parse('01/01/2011 '+b)
				
			}
			function createTable(data)
			{
				var html='';
				html+='<table class="table table-bordered">'+
			   '<thead>'+
			   '<tr>'+
			    '  <th>Stt</th>'+
			    '  <th>Username</th>'+
			     '  <th>Time</th>'+
			      '  <th>Số lỗi</th>'+
			    ' </tr>'+
			  ' </thead>'+
			  	'  <tbody>';
			  	 var i=0;
			  	 data.forEach(function(e) {
 
			  	 	if(i<10)
			  	 	{html+='<tr>'+
			  	 	'<td>'+(i+1)+'</td>'+
			        '<td><img width="40px" class="img-circle" height="40px" src="'+JSON.parse(e).imgSrc+'"></img>  '+ JSON.parse(e).user+'</td>'+
			       '<td>'+JSON.parse(e).time+'</td>'+
			       '<td>'+JSON.parse(e).error+'</td>'+
			      	'</tr>';
			      }
			      	i++;
			  	 });
			    
			     
			   html+='  </tbody>'+
			  '</table>';
			  return html;
			}
			//compare
			function compare(data)
			{	
				var tem=data.split('\n');
				var tem1 = tem.filter(tem => tem.length > 0); //not null

				for (var i = 0; i < tem1.length-1; i++) {
					for (var j = i+1; j < tem1.length; j++) {
						var json1=JSON.parse(tem1[i]);
						var json2=JSON.parse(tem1[j]);
						if(isEqual(json1.time,json2.time))
						{
							if(parseInt(json1.error)>parseInt(json2.error))
							{
								var t=tem1[i];
								tem1[i]=tem1[j];
								tem1[j]=t;
							}
						}
						else
						if(isGreater(json1.time,json2.time))
						{	var t=tem1[i];
							tem1[i]=tem1[j];
							tem1[j]=t;
						}
					}
				}
			
				$('#rank-content').html(createTable(tem1));
			}
			//read to Rank
			function readFile()
			{
				$.ajax({
					url: '/read',
					type: 'GET',
					
				})
				.done(function(data) {
					compare(data);
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
			}
			//
			$('#top').click(function(event) {
				readFile();
			});

			//global data
			var rsN,rsT,rsE=0;
			var cur=65; 	
			var error=0;
			var start=false;
			var time;	
			function timer()
			{	var min =0;
				var hour=0;
				var sec=0;
				return setInterval(function(){
					sec++;
					if(sec>60){
						min++;
						sec=0;
					}
					if(min>60)
					{
						min=0;
						hour++;
					}
					if(sec<10)var s='0'+sec;
					else s=sec;
					if(min<10)var m='0'+min;
					else m=min;
					if(hour<10)var h='0'+hour;
					else h=hour;
					var time=h+':'+m+':'+s;
					$('#timer').html(time);
					rsT=time;
				},1000);
			}
				
			function showResult(error)
			{
				$('#error').html(error);
				rsE=error;
			}
			
			$('#your').keydown(function(event){
				
				if(!start){ time=timer();start=true;}
				if(event.which>=65&&event.which<=90)
				{	
					if(cur==event.which)
					{	
						var id='#'+String.fromCharCode(event.which);
						$(id).css('background-color', 'orange');
						
						if(cur==90)
						{	clearInterval(time);
							if($('#username').html()=='Login')
							{	
								$('#modal-confirm').modal('show');
								$('#yes').click(function(event){
									$('#modal-confirm').modal('hide');
									writeFile($('#NAME').val(),rsT,rsE);
									alert('Đã lưu điểm của bạn. Hãy kiểm tra xem bạn có trong Top 10 không nhé. ');
									
								});
							}
							else
							{
								writeFile($('#username').html(),rsT,rsE);
								alert('Đã lưu điểm của bạn. Hãy kiểm tra xem bạn có trong Top 10 không nhé. ');
								
							}
						}
						cur++;
					}
					else showResult(++error);
				}
				else showResult(++error);
			});

			function writeFile(user,time,error)
			{	
				var data={user:user,time:time,error:error,imgSrc:$('#avatar').attr('src')}	;	
				$.ajax({
					url: '/write',
					type: 'POST',
					data: data,
				})
				.done(function() {
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
				
			}
});