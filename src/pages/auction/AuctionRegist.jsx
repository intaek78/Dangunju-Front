import React, {useState} from 'react'; 
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import "./bootstrap/bootstrap.min.css";

const Regist = () =>{ 

    const [aucSellerId, SetSellerId] = useState("");
    const [aucPostId, SetPostId] = useState("");
    const [aucTitle, SetTitle] = useState("");
    const [aucContent, SetContent] = useState("");
    const [aucStartAmount, SetBidAmount] = useState("");
    const [aucStartDate, SetAucStartDate] = useState("");
    const [aucEndDate, SetAucEndDate] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        // state에 저장한 값을 가져옵니다.
        //console.log(Password);

        if(aucSellerId==null || aucSellerId=='') {alert("Seller ID를 입력해주세요"); return false;}
        if(aucPostId==null || aucPostId=='') {alert("게시글번호를 입력해주세요"); return false;}
        if(aucTitle==null || aucTitle=='') {alert("제목을 입력해주세요"); return false;}
        if(aucContent==null || aucContent=='') {alert("내용을 입력해주세요"); return false;}
        if(aucStartAmount==null || aucStartAmount=='') {alert("경매시작금액을 입력해주세요"); return false;}
        if(aucStartDate==null || aucStartDate=='') {alert("경매시작일을 입력해주세요"); return false;}
        if(aucEndDate==null || aucEndDate=='') {alert("경매종료일을 입력해주세요"); return false;}
    
        let body = {
            sellerId: aucSellerId,
            aucPostId: aucPostId,
            title: aucTitle,
            content: aucContent,
            aucStartAmount: aucStartAmount,
            aucStartDate: aucStartDate,
            aucEndDate: aucEndDate,
        };
    
        axios
          .post("http://localhost:8080/auction/auctions", body)
          .then(function (res) {
            alert("게시글 "+ aucPostId +"번이 등록되었습니다. 경매목록 화면으로 이동합니다.");
            document.location.href = '/auction/auctions' ;
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })

         

      };
      
      const sellerIdHandler = (e) => {
        e.preventDefault();
        SetSellerId(e.target.value);
      };

      const postIdHandler = (e) => {
        e.preventDefault();
        SetPostId(e.target.value);
      };

      const titleHandler = (e) => {
        e.preventDefault();
        SetTitle(e.target.value);
      };

      const contentHandler = (e) => {
        e.preventDefault();
        SetContent(e.target.value);
      };

      const bidAmountHandler = (e) => {
        e.preventDefault();
        SetBidAmount(e.target.value);
      };

      const aucStartDateHandler = (e) => {
        e.preventDefault();
        SetAucStartDate(e.target.value);
      };

      const aucEndDateHandler = (e) => {
        e.preventDefault();
        SetAucEndDate(e.target.value);
      };
    

    return ( 
        <div class="container"> 
              <form class="form-horizontal" onSubmit={submitHandler}>
              <p></p>
              <h4 class="card-title">경매등록</h4>          
              <div class="form-group">
                <label class="col-sm-3 control-label" >Seller ID</label>
                <div class="col-sm-5"><input type="number" id="sellerId" class="form-control" placeholder="ex) 1111" value={aucSellerId} onChange={sellerIdHandler}  aria-label="Seller ID" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >글 번 호</label>
                <div class="col-sm-5"><input type="number" class="form-control" placeholder="ex) 1111" value={aucPostId} onChange={postIdHandler}  aria-label="postID" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >제 목</label>
                <div class="col-sm-5"><input type="text" class="form-control" placeholder="ex) 레고 43212 경매등록" value={aucTitle} onChange={titleHandler}  aria-label="title" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >내 용</label>
                <div class="col-sm-5"><input type="text" class="form-control" placeholder="ex) 금액 1000원, 미개봉 등" value={aucContent} onChange={contentHandler}  aria-label="content" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >경매시작금액</label>
                <div class="col-sm-5"><input type="number" class="form-control" placeholder="ex) 15000" value={aucStartAmount} onChange={bidAmountHandler}  aria-label="bidStartAmount" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >경매 시작일</label>
                <div class="col-sm-5"><input type="number" class="form-control" placeholder="ex) 20220505" value={aucStartDate} onChange={aucStartDateHandler}  aria-label="aucStartDate" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div class="form-group">
                <label class="col-sm-3 control-label" >경매 종료일</label>
                <div class="col-sm-5"><input type="number" class="form-control" placeholder="ex) 20220508" value={aucEndDate} onChange={aucEndDateHandler}  aria-label="aucEndDate" aria-describedby="basic-addon1"></input></div>
              </div>
              <p></p>
              <div><button  class="btn btn-outline-primary" onClick={submitHandler}>등록</button>   ||   <button  class="btn btn-outline-primary"><Link to={'/auction/auctions'}>경매목록</Link></button>   </div>            
             
             </form>
        </div>
        

    ); 
}

export default Regist;