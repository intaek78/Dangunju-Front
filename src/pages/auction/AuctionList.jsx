import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  Detail from './AuctionDetail';
import "./bootstrap/bootstrap.min.css";


const AuctionList = () =>{ 
  
    const [auctionData, setAuctions] = useState([]);
    
    useEffect(() => {
        axios
            //.get("http://localhost:8081/auction/auctions")
            .get("http://192.168.72.102:8081/auction/auctions")
            .then((response) => {
                setAuctions(response.data);
                //console.log("===>"+auctionData);
                //console.log("===>"+response._links);
            });
    }, []);
    
    /*const onClick2 = async () => { //비동기함수인 async를 사용합니다.
        try {            
            const response = await axios.get(
              "http://localhost:8080/auctions");
          // await으로 요청의 응답이 온뒤에 response.data를 set해줍니다.
          
          console.log("성공");
          console.log(response.data);
            setAuctions(response.data);
          
        } catch (e) {
          console.log(e);
        }
      };   
      <button onClick={onClick2}> 경매등록 </button>
      <Route path='/hello/:key1/:key2' component={Hello} />

      <Link to={`/postView/${item.no}`}>{ item.title }</Link>
      http://localhost:8080/users?search=lastName:doe,age>25
      <td><Link to={`/details/${auc.aucId2}`}></Link>  </td>  
      <td><Link to={{
                pathname: `/details`,
                state: {
                    aucId2 : auc.aucId2,
                    title: auc.title
                }
            }}>
            { auc.aucPostId }    
            </Link>  
        </td>        

        {auctionData._embedded && <textarea rows={7} value={JSON.stringify(auctionData._embedded, null, 2)} readOnly={true} />}
      */
      
 
        return ( 
            <div class="container">     
            <br></br>            
                <h4 class="card-title" align="center">경매목록</h4> 
                    <table class="table table-hover">
                        <thead align="center" class="table-active">
                            <th  scope="col">게시물번호</th>
                            <th  scope="col">제목</th>
                            <th  scope="col">내용</th>
                            <th  scope="col">경매시작금액</th>
                            <th  scope="col">상태</th>
                            <th  scope="col">경매시작일</th>
                            <th  scope="col">경매종료일</th>
                            <th  scope="col">셀러ID</th>
                        </thead>
                        <tbody align="center">
                            {auctionData._embedded && auctionData._embedded.auctions.map((auc) => (                            
                            <tr key={auc.auc_id}>
                                <td scope="row"><Link to={'/auction/details'}
                                              state={{aucId2: auc.aucId2, 
                                                      beAuctionedYnAuc: auc.beAuctionedYnAuc,
                                                      paymentReqYN : auc.paymentReqYN,
                                                      procGUBUN: auc.procGUBUN,
                                                      aucStartDate: auc.aucStartDate,
                                                      aucEndDate: auc.aucEndDate,
                                                      status: auc.status}}>{auc.aucPostId}</Link></td>                       
                                <td scope="row">{auc.title}</td>
                                <td scope="row">{auc.content}</td>
                                <td scope="row">{auc.aucStartAmount}</td>
                                {auc.status === null
                                    ? <td scope="row">미입찰</td>
                                    : <td scope="row">{auc.status}</td>
                                }
                                <td scope="row">{auc.aucStartDate}</td>
                                <td scope="row">{auc.aucEndDate}</td>
                                
                                <td scope="row">{auc.sellerId}</td>
                                
                            </tr> ))}              
                        </tbody>
                          
                    </table>
                    <div align="center">
                        <button class="btn btn-outline-primary"><Link to={'/auction/regists'}>신규등록</Link></button>
                    </div>
                    
            
            </div>

        ); 
    
}

export default AuctionList;