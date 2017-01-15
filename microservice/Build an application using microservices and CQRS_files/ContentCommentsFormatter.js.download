var ContentCommentsFormatter = window.ContentCommentsFormatter || {};
(function() {

	
en_map = {
		"COMMENTS":"Comments",
        "COMMENT": "Comment",
        "POST_BY": "Posted by {1} on {2}",
		"NO_COMMENTS":"Be the first to add a comment",
		"SUBMIT":"Submit",
		"ADD_A_COMMENT":"Add a comment",
		"NEWEST":"Newest",
		"OLDEST":"Oldest",
		"POPULAR":"Popular",
		"SUBSCRIBE_ME":"Subscribe me to comment notifications",
		"REPLY":"Reply",
		"REPORT_ABUSE":"Report Abuse",
		"REPORT_ABUSE_USER_COMMENT":"--- Add any comments below this line ---",
		"EDIT":"Edit",
		"EDITED":"Edited",
		"YOU":"You",
		"SAVE":"Save",
		"DELETE":"Delete",
		"HIDE_REPLIES":"Hide Replies",
		"VIEW_ALL_REPLIES":"View all __replyCount__ replies",
		"MAX_CHAR_LIMIT":" characters used, Please use a maximum of ## characters.",
		"POST_FAILED":"Your comment cannot be posted at this time. Please try again later.",
		"GET_FAILED":"There is a problem in retrieving the comments. Please refresh the page later."
};	
	
ru_map = {
		"COMMENTS": "Комментарии",
        "COMMENT": "Комментарий",
        "POST_BY": "Выложено (Размещено) <strong>{1}</strong> {2}",
		"NO_COMMENTS":'Нет комментариев',
		"SUBMIT":"Отправить",
		"ADD_A_COMMENT":"Добавить комментарий",
		"NEWEST":"Новейший",
		"OLDEST":"Старейший",
		"POPULAR":"Популярный",
		"SUBSCRIBE_ME":"Подпишите меня на уведомления к комментариям",
		"REPLY":"Ответ",
		"REPORT_ABUSE":"Сообщение о нарушениях",
		"REPORT_ABUSE_USER_COMMENT":"--- Добавьте любой комментарий ниже ---",
		"EDIT":"Редактировать",
		"EDITED":"Отредактировано",
		"YOU":"Вы",
		"SAVE":"Сохранить",
		"DELETE":"Удалить",
		"HIDE_REPLIES":"Скрыть ответы",
		"VIEW_ALL_REPLIES":"Посмотреть все __replyCount__ ответов",
		"MAX_CHAR_LIMIT":" символов использовано, Пожалуйста  можете использовать максимальное число ## символов.",
		"POST_FAILED":"В настоящее время ваше сообщение не может быть опубликовано. Пожалуйста, попробуйте позже.",
		"GET_FAILED":"Возникла проблема при загрузке комментариев. Пожалуйста, обновите страничку позже."		
};	

cn_map = {
		"COMMENTS":"评论",
        "COMMENT": "评论",
        "POST_BY": "由 <strong>{1}</strong>  于 {2} ",
		"NO_COMMENTS":"第一个评论",
		"SUBMIT":"提交",
		"ADD_A_COMMENT":"添加评论",
		"NEWEST":"最新的",
		"OLDEST":"历史",
		"POPULAR":"热门",
		"SUBSCRIBE_ME":"有新评论时提醒我",
		"REPLY":"回复",
		"REPORT_ABUSE":"报告滥用",
		"REPORT_ABUSE_USER_COMMENT":"--- 在下方添加评论 ---",
		"EDIT":"编辑",
		"EDITED":"编辑",
		"YOU":"您",
		"SAVE":"保存",
		"DELETE":"删除",
		"HIDE_REPLIES":"隐藏回复",
		"VIEW_ALL_REPLIES":"查看所有 __replyCount__ 条回复",
		"MAX_CHAR_LIMIT":" 已用字符，最多可使用 ## 个字符",
		"POST_FAILED":"您的评论暂时无法发布，请稍后再试。",
		"GET_FAILED":"在检索评论时出错，请稍后刷新。"				
};	

br_map = {
		"COMMENTS":"Comentários",
        "COMMENT": "Comentário",
        "POST_BY": "Enviado por <strong>{1}</strong> em {2}",
		"NO_COMMENTS":"Nenhum comentário postado para esse artigo",
		"SUBMIT":"Postar",
		"ADD_A_COMMENT":"Incluir comentário",
		"NEWEST":"Mais Recentes",
		"OLDEST":"Mais Antigos",
		"POPULAR":"Mais Populares",
		"SUBSCRIBE_ME":"Receba notificações dos comentários",
		"REPLY":"Responder",
		"REPORT_ABUSE":"Relatar abuso",
		"REPORT_ABUSE_USER_COMMENT":"-- Adicione os comentários abaixo desta linha --",
		"EDIT":"Editar",
		"EDITED":"Editado",
		"YOU":"Você",
		"SAVE":"Salvar",
		"DELETE":"Deletar",
		"HIDE_REPLIES":"Esconder Respostas",
		"VIEW_ALL_REPLIES":"Ver todas as __replyCount__ respostas",
		"MAX_CHAR_LIMIT":" caracteres usados. Por favor, use no máximo ## caracteres.",
		"POST_FAILED":"Seu comentário não pôde ser postado neste momento. Tente novamente mais tarde.",
		"GET_FAILED":"Há um problema na recuperação dos comentários. Atualize a página mais tarde."
};	

vn_map = {
		"COMMENTS":"Comments",
        "COMMENT": "Comment",
        "POST_BY": "Posted by {1} on {2}",
		"NO_COMMENTS":"Be the first to add a comment",
		"SUBMIT":"Submit",
		"ADD_A_COMMENT":"Add a comment",
		"NEWEST":"Newest",
		"OLDEST":"Oldest",
		"POPULAR":"Popular",
		"SUBSCRIBE_ME":"Subscribe me to comment notifications",
		"REPLY":"Reply",
		"REPORT_ABUSE":"Report Abuse",
		"REPORT_ABUSE_USER_COMMENT":"--- Add any comments below this line ---",
		"EDIT":"Edit",
		"EDITED":"Edited",
		"YOU":"You",
		"SAVE":"Save",
		"DELETE":"Delete",
		"HIDE_REPLIES":"Hide Replies",
		"VIEW_ALL_REPLIES":"View all __replyCount__ replies",
		"MAX_CHAR_LIMIT":" characters used, Please use a maximum of ## characters.",
		"POST_FAILED":"Your comment cannot be posted at this time. Please try again later.",
		"GET_FAILED":"There is a problem in retrieving the comments. Please refresh the page later."
};	

ssa_map = {
		"COMMENTS":"Comentarios",
        "COMMENT": "Comentario",
        "POST_BY": "Posteado por <strong>{1}</strong> el {2}",
		"NO_COMMENTS":"No hay comentarios en este artículo",
		"SUBMIT":"Postear",
		"ADD_A_COMMENT":"Agregar comentario",
		"NEWEST":"Más recientes",
		"OLDEST":"Más antiguos",
		"POPULAR":"Más populares",
		"SUBSCRIBE_ME":"Reciba notificaciones de los comentarios",
		"REPLY":"Responder",
		"REPORT_ABUSE":"Reportar abusos",
		"REPORT_ABUSE_USER_COMMENT":"--- Agregue comentarios debajo de esta línea ---",
		"EDIT":"Editar",
		"EDITED":"Editado",
		"YOU":"Usted",
		"SAVE":"Salvar",
		"DELETE":"Borrar",
		"HIDE_REPLIES":"Esconder respuestas",
		"VIEW_ALL_REPLIES":"Ver todas las __replyCount__ respuestas",
		"MAX_CHAR_LIMIT":" caracteres usados. Por favor, use como máximo ## caracteres.",
		"POST_FAILED":"Su comentario no se puede postear en este momento. Por favor inténtelo más tarde.",
		"GET_FAILED":"Hay un problema para salvar los comentarios. Por favor inténtelo más tarde."
};	

jp_map = {
		"COMMENTS":"コメント",
        "COMMENT": "コメント",
        "POST_BY": "<strong>{1}</strong> によって {2} に投稿されました",
		"NO_COMMENTS":"この記事にはコメントがありません",
		"SUBMIT":"投稿",
		"ADD_A_COMMENT":"コメントを追加",
		"NEWEST":"最新のコメント",
		"OLDEST":"その他のコメント",
		"POPULAR":"人気のコメント",
		"SUBSCRIBE_ME":"コメント通知を登録する",
		"REPLY":"返信",
		"REPORT_ABUSE":"不正使用の報告",
		"REPORT_ABUSE_USER_COMMENT":"--- この行の下に任意のコメントを追加 ---",
		"EDIT":"編集",
		"EDITED":"編集済",
		"YOU":"あなた",
		"SAVE":"保存",
		"DELETE":"削除",
		"HIDE_REPLIES":"返信を隠す",
		"VIEW_ALL_REPLIES":"__replyCount__ 件すべての返信を見る",
		"MAX_CHAR_LIMIT":" 文字を使っています。最大 ## 文字までしか使えません。",
		"POST_FAILED":"お客様のコメントは、この時点で投稿することはできません。後でやり直してください。",
		"GET_FAILED":"コメントの取得に問題があります。後ほどページをリフレッシュしてからお試しください。"
};	

/*
SITE_ID	SITE_NAME
1	worldwide                       
90	ssa                             
10	china                           
20	korea                           
30	taiwan                          
40	russia                          
50	alphaworks                      
60	japan                           
70	vietnam                         
80	brazil                          
*/

/*
 * Pass the TEXT_KEY yo translate, key in UPPERCASE, pass any numbers 
 * as argument to this method in the order you want it to be substituted.
 * Ex: Translate("MAX_CHAR_LIMIT",1000) will translate first ## with 1000
 */
ContentCommentsFormatter.Translate = function (site_id, text_key) {
	result = new String();
	//debugger;
	switch (site_id) {
		case '1': //ww
			result = en_map[text_key];
			break;
		case '10'://china
			result = cn_map[text_key];
			break;
		case '40': //russia
			result = ru_map[text_key];
			break;
		case '60'://japan
			result = jp_map[text_key];
			break;
		case '70'://vietnam
			result = vn_map[text_key];
			break;
		case '80': //brazil
			result = br_map[text_key];
			break;
		case '90': //ssa
			result = ssa_map[text_key];
			break;
		default:
			result = "No matching language";
			break;
		}
	
	if (result == null || result == undefined){
		result = text_key;
	} else {
		 //check for any arguments which needs to be substituted 
		 for (var i = 2; i < arguments.length && arguments[i] != undefined; i++) {
			    result = result.replace("##",arguments[i]);
		  };
	}
	return result;
};
	
}).apply(ContentCommentsFormatter);