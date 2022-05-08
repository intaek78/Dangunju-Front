import React, {useState} from 'react'; 
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

const Regist = () =>{ 

    const [aucSellerId, SetSellerId] = useState("");
    const [aucPostId, SetPostId] = useState("");
    const [aucTitle, SetTitle] = useState("");
    const [aucContent, SetContent] = useState("");
    const [auc_start_amount, SetBidAmount] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        // state에 저장한 값을 가져옵니다.
        //console.log(Password);

        if(aucSellerId==null || aucSellerId=='') {alert("Seller ID를 입력해주세요"); return false;}
        if(aucPostId==null || aucPostId=='') {alert("게시글번호를 입력해주세요"); return false;}
        if(aucTitle==null || aucTitle=='') {alert("제목을 입력해주세요"); return false;}
        if(aucContent==null || aucContent=='') {alert("내용을 입력해주세요"); return false;}
        if(auc_start_amount==null || auc_start_amount=='') {alert("경매시작금액을 입력해주세요"); return false;}
    
        let body = {
            sellerId: aucSellerId,
            aucPostId: aucPostId,
            title: aucTitle,
            content: aucContent,
            auc_start_amount: auc_start_amount,
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
    

    return ( 
        <div class="card"> 
          <form onSubmit={submitHandler}>
          <h2 class="card-title" align="center">경매등록</h2>          
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Seller ID</span>
            <input type="number" class="form-control" placeholder="ex) 1111" value={aucSellerId} onChange={sellerIdHandler}  aria-label="Seller ID" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">글번호</span>
            <input type="number" class="form-control" placeholder="ex) 1111" value={aucPostId} onChange={postIdHandler}  aria-label="postID" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">제목</span>
            <input type="text" class="form-control" placeholder="ex) 레고 43212 경매등록" value={aucTitle} onChange={titleHandler}  aria-label="title" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">내용</span>
            <input type="text" class="form-control" placeholder="ex) 금액 1000원, 미개봉 등" value={aucContent} onChange={contentHandler}  aria-label="content" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">경매시작금액</span>
            <input type="number" class="form-control" placeholder="ex) 15000" value={auc_start_amount} onChange={bidAmountHandler}  aria-label="bidStartAmount" aria-describedby="basic-addon1"></input>
          </div>
          <div align="center"><button  class="btn btn-dark" onClick={submitHandler}>등록</button>   ||   <button  class="btn btn-dark"><Link to={'/auction/auctions'}>경매목록</Link></button>   </div>            
           </form>
           
        </div>
        

    ); 
}

export default Regist;