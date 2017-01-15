var ContentComments = window.ContentComments || {};
(function() {

 GET_URI = '/developerworks/maverick/execute/getComments';
 POST_URI = '/developerworks/maverick/execute/postComment';
 DELETE_URI = '/developerworks/maverick/execute/deleteComments';
 VOTE_URI = '/developerworks/maverick/execute/voteComment';
 
 MAX_CHAR_LIMIT = 1000;
 
 ContentComments.DEFAULT_PROFILE_PICTURE_URI = '/developerworks/maverick/image/user/user-icon.png';
 ContentComments.DEFAULT_ADMIN_PROFILE_PICTURE_URI = '/developerworks/maverick/image/user/admin-user-icon.png';
 ContentComments.JSON = 'json';
 
 var FetchUrl = null;
 var DateFormat = null;
 
 var InfoData ={
		 NotifyCheckboxLabel:'',
		 contentId:null,
		 siteId:'1',
		 isUserLoggedIn : false,
		 isAdminUser: false,
		 screenName:''
 };
 
 
 InitGetCommentsUrl = function(){
	 FetchUrl = GET_URI + '?contentID=' + InfoData.contentId +'&siteID='+ InfoData.siteId +'&format='+ ContentComments.JSON;
 };
		 
 ContentComments.GetCommentsUrl = function(){
	 return FetchUrl;
 };

 InitLocale = function(site_id){
			//debugger;
			switch (site_id) {
				case '1': //ww
					moment.locale('en');
					DateFormat = 'DD MMM YYYY';
					break;
				case '10'://china
					moment.locale('zh');
					DateFormat = 'YYYY 年 MM 月 DD 日';
					break;
				case '40': //russia
					moment.locale('ru');
					DateFormat = 'DD.MM.YYYY';
					break;
				case '60'://japan
					moment.locale('ja');
					DateFormat = 'YYYY年 MM月 DD日';
					break;
				case '70'://vietnam
					moment.locale('vi');
					DateFormat = 'DD MM YYYY';
					break;
				case '80': //brazil
					moment.locale('pt');
					DateFormat = 'DD/MMM/YYYY';
					break;
				case '90': //ssa
					moment.locale('es');
					DateFormat = 'DD-MM-YYYY';
					break;
				default:
					moment.locale('en');
				DateFormat = 'DD MMM yyyy';
					break;
				}
 };

 ContentComments.GetDateFormat = function(){
	 return DateFormat;
 };

 ContentComments.InitPlugin = function () {
	 	//	debugger;
	    InitGetCommentsUrl();
	    InitLocale(InfoData.siteId);
	    
    	$(InfoData.pluginDivId).comments({
			profilePictureURL: InfoData.isAdminUser?ContentComments.DEFAULT_ADMIN_PROFILE_PICTURE_URI:ContentComments.DEFAULT_PROFILE_PICTURE_URI,
			youText: InfoData.screenName,
			roundProfilePictures:true,
			textareaRows: 2,
			textareaPlaceholderText: Translate('ADD_A_COMMENT'),
			noCommentsText: Translate('NO_COMMENTS'),
			sendText:Translate('SUBMIT'),
			newestText: Translate('NEWEST'),
			oldestText: Translate('OLDEST'),
			popularText: Translate('POPULAR'),
            replyText: Translate('REPLY'),
            reportAbuseText: Translate('REPORT_ABUSE'),
            editText: Translate('EDIT'),
            editedText: Translate('EDITED'),
            saveText: Translate('SAVE'),
            deleteText: Translate('DELETE'),
            viewAllRepliesText: Translate('VIEW_ALL_REPLIES'),
            hideRepliesText: Translate('HIDE_REPLIES'),
			readOnly : !InfoData.isUserLoggedIn,
			currentUserIsAdmin: InfoData.isAdminUser,
    	    //deleteButtonColor: 'red',
    	    //enableNavigation : true,
			enableAttachments: false,
		    enableReplying: true,
	    	reportAbuseURL : this.GetReportAbuseURL(InfoData.siteId),
			reportAbuseIconURL: '/developerworks/maverick/image/report-abuse.png',
			reportAbuseUserCommentText: Translate('REPORT_ABUSE_USER_COMMENT'),
			postByText: Translate('POST_BY'),
			commentText: Translate('COMMENT'),
		    enableReportAbusing : true,
			enableEditing: true,
			enableUpvoting:true,					    					    
			fieldMappings: {
			    id: 'comment_id',
			    parent: 'parent_id',
			    created: 'create_date',
			    modified: 'update_date',
			    content: 'comment',
			    fullname: 'screen_name',
			    upvoteCount: 'upvote_count',
			    userHasUpvoted: 'userHasUpvoted',
			    createdByCurrentUser : 'createdByCurrentUser',
			    createdByAdmin : 'createdByAdmin'
			},

		getComments: function(success, error) {
			// Get Comments
		    //debugger;


			$.ajax({
				url: ContentComments.GetCommentsUrl(),
				dataType: 'json',
				success: function (data) {
					//debugger;
				    console.log("get comments ajax success");
					if(data.comments == undefined && !data.comments){
						//alert(Translate("GET_FAILED"));
						console.log("get comments data invalid" + data);
					} else {
						//set total comments
						InfoData.commentCount = data.comments.length;
						$(InfoData.totalCommentsDivId).text(InfoData.commentCount);
				    	success(data.comments);
					}
				},
				error: function (data) {
					console.log("ajax error on get comments" + data);
				}
			}); 
		},
		postComment: function(data, success, error) {
			//debugger; 
			if(!ContentComments.ValidateCharLimit(data.comment)){
				error();
			} else {
				$.ajax({
		           	method: 'POST',
					url: POST_URI,
	                data: {
	                	contentID: InfoData.contentId,
	                	cb: data.comment,
	                    siteID: InfoData.siteId,
	                    commentID:data.comment_id,
	                    parentID: data.parent_id,
	                    format:ContentComments.JSON //used while returning data
	                },
					success: function (returnData) {
					    //console.log("ajax success");
						//debugger;
						if(returnData.result != undefined && !returnData.result){
							alert(Translate("POST_FAILED"));
							error();
						} else {
							$(InfoData.totalCommentsDivId).text(++InfoData.commentCount);
							data.comment = returnData.comment;
							data.comment_id = returnData.commentId;
							success(data);
						};
					},
					error: function (data) {
						console.log("postComment ajax error" + data);
					}
				});
			}
		},
		putComment: function(data, success, error) {
			//debugger;
			if(!ContentComments.ValidateCharLimit(data.comment)){
				error();
			} else {
				$.ajax({
		           	method: 'POST',
					url: POST_URI,
	                data: {
	                	contentID: InfoData.contentId,
	                	cb: data.comment,
	                    siteID: InfoData.siteId,
	                    commentID:data.comment_id,
	                    parentID: data.parent_id,
	                    isUpdate:true,
	                    createdByCurrentUser : data.createdByCurrentUser,
	                    //createdByAdmin:data.createdByAdmin,
	                    format:ContentComments.JSON //used while returning data
	                },
					success: function (returnData) {
					    //console.log("ajax success"); 
						//debugger;
						if(returnData.result != undefined && !returnData.result){
							alert(Translate("POST_FAILED"));
							error();
						} else {
							data.comment = returnData.comment;
							success(data);
						};
					},
					error: function (data) {
						console.log("putComment ajax error" + data);
					}
				});
			} 
		},
		deleteComment: function(data, success, error) {
			$.ajax({
	           	method: 'POST',
				url: DELETE_URI,
                data: {
                	COMMENT_ID: data.comment_id,
                	createdByCurrentUser:data.createdByCurrentUser,
                	screenName:InfoData.screenName,
                    format:ContentComments.JSON //used while returning data
                },
				success: function (returnData) {
//					debugger;
					$(InfoData.totalCommentsDivId).text(--InfoData.commentCount);
					success();
				},
				error: function (data) {
					console.log("deleteComment ajax error" + data);
				}
			});
		},
/*		reportAbuseComment: function(data, success, error) {
			deleteComments
				success();
		},*/
		upvoteComment: function(data, success, error) {
			//debugger;
			$.ajax({
	           	method: 'POST',
				url: VOTE_URI,
                data: {
                	commentID: data.comment_id,
                	upvoteCount: data.upvote_count,
                	hasUpvoted: data.userHasUpvoted,
                    format:ContentComments.JSON //used while returning data
                },
				success: function (returnData) {
				    //console.log("ajax success");
					//debugger;
					success(data);
				},
				error: function (data) {
					console.log("upvoteComment ajax error" + data);
				}
			});
		},
		reportAbuse: function(dataArray, success, error) {
			//debugger;
			setTimeout(function() {
				success(dataArray);
			}, 500);
		},
		uploadAttachments: function(dataArray, success, error) {
			setTimeout(function() {
				success(dataArray);
			}, 500);
		},
		timeFormatter: function(time) {
//			debugger;
//			console.log(moment.locale()); // pt-BR
//			moment.locale('zh-CN');
			//moment.locale("DD/MMM/YYYY");
//			console.log(moment.locale()); // pt-BR
//			console.log(moment(time));
//			console.log(moment(time).format("DD/MMM/YYYY"));
	        return moment(time).format(ContentComments.GetDateFormat());
	    }
//		refresh: function() {
        	//debugger;
//        },
//        textFormatter: function(text_key) {
//            return Translate(text_key); 
  //      }        
	});
 };
 
 Translate = function (text_key) {
	 //debugger;	 
	 return ContentCommentsFormatter.Translate(InfoData.siteId,text_key,arguments[1],arguments[2]);
 };

ContentComments.GetReportAbuseURL = function (siteId) {
	//debugger;
	var abuseURL = '/developerworks/community/report?lang=' + (siteId=='70'?'en':this.GetLanguage(siteId));
	return abuseURL ;	
};
ContentComments.GetLanguage = function (site_id) {
		result = "en";
		//debugger;
		switch (site_id) {
			case '1': //ww
				result = "en";
				break;
			case '10'://china
				result = "cn";
				break;
			case '40': //russia
				result = "ru";
				break;
			case '60'://japan
				result = "jp";
				break;
			case '70'://vietnam
				result = "vn";
				break;
			case '80': //brazil
				result = "br";
				break;
			case '90': //ssa
				result = "ssa";
				break;
			default:
				result = "en";
				break;
			}
		
		return result;
};
	
ContentComments.ValidateCharLimit = function (elem) {
	 var comment = elem.trim();
	if(elem != undefined &&  comment.length > MAX_CHAR_LIMIT){
		alert(comment.length + Translate("MAX_CHAR_LIMIT", MAX_CHAR_LIMIT));
		return false;
	}
	return true;
 };

 ContentComments.SaveNotificationPreference = function (elem) {
			$.ajax({
				url: "/developerworks/maverick/execute/save_opt_in",
				data : { 	
							content_id: InfoData.contentId,
				 			hash: this.value,
				  			notify:this.checked?1:0,
							format : 'json'					  			
				  	 },
				//dataType: 'json',
				success: function (data) {
					//debugger;
					console.log("SaveNotificationPreference success");
					//alert(NOTIFY_PREF_SAVED_MSG);
				},
				error: function (data) {
					//debugger
					console.log("SaveNotificationPreference ajax error" + data);
					//alert("Error saving your notification preference");
				}
			}); 				
};

ContentComments.Setup = function (initInfo) {
		$.extend(true,InfoData, initInfo); //setup data into InfoData
		//debugger;
		InfoData.NotifyCheckboxLabel = 'label[for="' + $(InfoData.notifyElementId)[0].id +'"]';
//		$(InfoData.NotifyCheckboxLabel)[0].innerHTML = Translate($(InfoData.NotifyCheckboxLabel)[0].innerHTML);
		$.ajax({
			url: "/developerworks/maverick/execute/getCurrentUserInfo",
			data : { 
					content_id: initInfo.contentId,
					format : 'json'
				 },
			dataType: 'json',
			success: function (data) {
				//debugger;
				console.log("get current user info success");
				$.extend(true,InfoData, data); //setup data into InfoData
				
				//If user is logged in setup divs and notify accordingly
				if(data.isUserLoggedIn){
					//$(InfoData.NotifyCheckboxLabel)[0].style.color='';					
					$(InfoData.loginMessageDivId).hide();
					$(InfoData.notifyElementId).prop("checked", InfoData.isNotifyUser);
					$(InfoData.notifyElementId).prop("disabled", false);
					$(InfoData.notifyElementId).val(InfoData.notifyHash);
					$(InfoData.notifyElementId).bind("click", ContentComments.SaveNotificationPreference);
				} else {
					$(InfoData.loginMessageDivId).show();
					$(InfoData.notifyElementId).prop("disabled", true);
					$(InfoData.NotifyCheckboxLabel)[0].style.color='#ccc';					
				}  
				ContentComments.InitPlugin(); 
			},
			error: function (data) {
				console.log("ajax error on get current user info" + data);
				$.extend(true,InfoData, initInfo, data); //setup data into InfoData
				$(InfoData.NotifyCheckboxLabel)[0].style.color='#ccc';					
			}
		}); 				
 };

}).apply(ContentComments);
