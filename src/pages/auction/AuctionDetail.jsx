import React, {useState, useEffect, useHistory } from 'react'; 
import { Route, Link, useLocation, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import "./bootstrap/bootstrap.min.css";

const Detail = () =>{ 
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("==>>"+location.state.aucId2);

  const fin_aucId = location.state.aucId2;
  const fin_beAuctionedYnAuc = location.state.beAuctionedYnAuc; 
  const fin_paymentReqYN = location.state.paymentReqYN;  
  const fin_status = location.state.status;  
  const tmpVar = "Y";
  const fin_url = "http://localhost:8080/auction/auctions/" + fin_aucId;
  console.log("fin_url   "+fin_url);
  


    //console.log(props);
    console.log(location);
    //console.log(match);

    const [aucSellerId, SetSellerId] = useState("");
    const [aucPostId, SetPostId] = useState("");
    const [aucTitle, SetTitle] = useState("");
    const [aucContent, SetContent] = useState("");
    const [aucBidAmount, SetBidAmount] = useState("");
    const [auctionData, setAuctions] = useState([]);
    const [aucProcGubun, SetProcGubun] = useState("");

    const [bidData, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState([]);
    const [bidMem, setBidMem] = useState([]);

    const [aucStartDate, SetAucStartDate] = useState("");
    const [aucEndDate, SetAucEndDate] = useState("");



    useEffect(() => {
        axios
            .get(fin_url)
            .then((response) => {
                setAuctions(response.data);
                SetSellerId(response.data.sellerId);
                SetPostId(response.data.aucPostId);
                SetTitle(response.data.title);
                SetContent(response.data.content);
                SetBidAmount(response.data.aucStartAmount);
                SetProcGubun(response.data.procGUBUN);
                SetAucStartDate(response.data.aucStartDate);
                SetAucEndDate(response.data.aucEndDate);
                //console.log("===>"+response._links);
            });
    }, []);

    useEffect(() => {
      axios
          .get("http://localhost:8080/auction/bids")
          .then((response) => {
              setBids(response.data);
              //console.log("===>"+auctionData);
              //console.log("===>"+response._links);
          });
  }, []);

      //판매취소
      const AuctionCancelled = (e) => {
        e.preventDefault();

          if (window.confirm("정말 판매내역을 삭제하시겠습니까?")) {
            axios.delete(fin_url)
              .then(function (res) {
                navigate('/auction/auctions');
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
          } 
      };

      //입찰
      const submitHandler = (e) => {
        e.preventDefault();
        let body = {
            aucPostId: aucPostId,
            bidAmount: bidAmount,
            bidMemId: bidMem,
            aucId: fin_aucId,
        };
        console.log("bid body bidAmount==>" + body.bidAmount);

        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        var dateString = year + "" + month  + "" + day;

        if(dateString>aucEndDate) {
          alert("경매가 종료되었습니다.");
          return false;
        }
        //document.write(year + '/' + month + '/' + date)

        if(bidAmount==null || bidAmount=='') {return false;}

        const bid_url = "http://localhost:8080/auction/bids";     
        axios
          .post(bid_url, body)
          .then(function (res) {
            console.log("bid insert res2=> "+JSON.stringify(res.data, null, 2));
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          window.location.reload();        
          //document.location.href = '/auction/details'
      };

      //낙찰-낙찰장부 입력
      const beAuctionedHandler = (bidId2, e) => {
        e.preventDefault();

        let body = {
          aucPostId: aucPostId,
          aucId: fin_aucId,
          bidId: bidId2,
        };

        const beauction_url = "http://localhost:8080/auction/beauctions";        
    
        axios
        .post(beauction_url, body)
        .then(function (res) {
          //console.log("beAuction insert res=> "+JSON.stringify(res.data, null, 2));
          window.location.reload();
          //document.location.href = '/auction/auctions' ;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      };

      //결제요청
      const paymentHandler = (bid, e) => {

        if (window.confirm("결제요청 하시겠습니까?\n 낙찰금액(원) : " + bid.bidAmount ))  {
          e.preventDefault();
          let body = {
              buyer: bid.bidMemId, //임시
              amount: bid.bidAmount,
              postGubun: "AUTION",
              paymentGubun: "REQUEST_PAYMENT",
              postId: bid.aucPostId,
              postTitle: aucTitle,
              aucId: fin_aucId,
              seller: "05625", //임시
          };
          console.log("결제 요청 body==>" + JSON.stringify(body, null, 2));

          console.log("beAuction insert res=> "+JSON.stringify(body, null, 2));
          axios
              .post("http://localhost:8080/auction/push", body)
              .then(function (res) {
                console.log("결제장부 insert req=> "+JSON.stringify(res.data, null, 2));
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
          //const payment_url = "http://localhost:8080/pament/requestPayment";     
          /*
          axios
            .post(payment_url, body)
            .then(function (res) {
              console.log("bid insert res2=> "+JSON.stringify(res.data, null, 2));
              //이후 상태변경 수정필요  

              axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("beAuction insert res=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            */
            console.log("beAuction insert res=> "+JSON.stringify(body, null, 2));
            axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("결제장부 insert req=> "+JSON.stringify(res.data, null, 2));
                  alert("결과 : "+res.data.state.status);
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
            
            //window.location.reload();
            document.location.href = '/auction/auctions' ;
        }
      };


      //결제취소
      const payCancelHandler = (bid, e) => {

        if (window.confirm("결제취소 하시겠습니까?"))  {
          e.preventDefault();
          let body = {
              buyer: bid.bidMemId, //임시
              amount: bid.bidAmount,
              postGubun: "AUTION",
              paymentGubun: "CANCEL_PAYMENT",
              postId: bid.aucPostId,
              postTitle: aucTitle,
              aucId: fin_aucId,
              seller: "05625", //임시
          };
          console.log("결제 취소 body==>" + JSON.stringify(body, null, 2));
          axios
              .post("http://localhost:8080/auction/push", body)
              .then(function (res) {
                console.log("결제장부 insert req=> "+JSON.stringify(res.data, null, 2));
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
          /*
          axios
            .post(payment_url, body)
            .then(function (res) {
              console.log("bid insert res2=> "+JSON.stringify(res.data, null, 2));
              //이후 상태변경 수정필요  

              axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("beAuction insert res=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            */
            console.log("beAuction insert res=> "+JSON.stringify(body, null, 2));
            axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("결제취소 insert req=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
            //window.location.reload();
            document.location.href = '/auction/auctions' ;
        }
      };


      //판매종료
      const completeHandler = (e) => {

        if (window.confirm("판매종료 하시겠습니까?" ))  {
          e.preventDefault();
          let body = {
              postGubun: "AUC",
              paymentGubun: "END",
              postId: aucPostId,
              postTitle: aucTitle,
              aucId: fin_aucId,
              seller: "05625", //임시
          };
          console.log("판매종료 body==>" + JSON.stringify(body, null, 2));
          const payment_url = "http://localhost:8080/pament/requestPayment";     
          /*
          axios
            .post(payment_url, body)
            .then(function (res) {
              console.log("bid insert res2=> "+JSON.stringify(res.data, null, 2));
              //이후 상태변경 수정필요  

              axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("beAuction insert res=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            */
            axios
                .post("http://localhost:8080/auction/aucpayments", body)
                .then(function (res) {
                  console.log("결제장부 insert req=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
            //window.location.reload();
            document.location.href = '/auction/auctions' ;
        }
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

      const bidHandler = (e) => {
        e.preventDefault();
        setBidAmount(e.target.value);
      };

      const bidMemHandler = (e) => {
        e.preventDefault();
        setBidMem(e.target.value);
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
        <div class="container" > 
          <form >
          <p></p>
          <h4 class="card-title">경매상세 ({fin_status})</h4>
            <div class="form-group">
              <div class="col-sm-5"><input type="hidden" id="sellerid" class="form-control" disabled="true" placeholder="ex) 1111" value={aucSellerId} onChange={sellerIdHandler}  aria-label="Seller ID" aria-describedby="basic-addon1"></input></div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label" >글번호</label>
              <div class="col-sm-5"><input type="number" class="form-control" disabled="true" placeholder="ex) 1111" value={aucPostId} onChange={postIdHandler}  aria-label="postID" aria-describedby="basic-addon1"></input></div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label" >제목</label>
              <div class="col-sm-5"><input type="text" class="form-control" disabled="true" placeholder="ex) 레고 43212 경매등록" value={aucTitle} onChange={titleHandler}  aria-label="title" aria-describedby="basic-addon1"></input></div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label" >내용</label>
              <div class="col-sm-5"><input type="text" class="form-control" disabled="true" placeholder="ex) 금액 1000원, 미개봉 등" value={aucContent} onChange={contentHandler}  aria-label="content" aria-describedby="basic-addon1"></input></div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label" >경매시작금액</label>
              <div class="col-sm-5"><input type="number" class="form-control" disabled="true" placeholder="ex) 15000" value={aucBidAmount} onChange={bidAmountHandler}  aria-label="bidStartAmount" aria-describedby="basic-addon1"></input></div>
            </div>
            <div class="form-group">
            <label class="col-sm-3 control-label" >경매시작일</label>
            <div class="col-sm-5"><input type="number" class="form-control" disabled="true"  placeholder="ex) 20220505" value={aucStartDate} onChange={aucStartDateHandler}  aria-label="aucStartDate" aria-describedby="basic-addon1"></input></div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label" >경매종료일</label>
            <div class="col-sm-5"><input type="number" class="form-control" disabled="true"  placeholder="ex) 20220508" value={aucEndDate} onChange={aucEndDateHandler}  aria-label="aucEndDate" aria-describedby="basic-addon1"></input></div>
          </div>
          <p></p>
          <div>
            {
              fin_beAuctionedYnAuc === "Y"
              ? null
              : <button class="btn btn-outline-primary" onClick={AuctionCancelled}>판매취소</button>
            }
            <button class="btn btn-outline-primary"><Link to={'/auction/auctions'}>경매목록</Link></button>
          </div>        
           </form >
              <form onSubmit={submitHandler}>
                <h4  class="card-title" align="center" >입찰목록</h4> 
                    <table  class="table table-hover">
                        <thead align="center" class="table-active">
                            <th scope="col">게시글번호</th>
                            <th scope="col">입찰자ID</th>
                            <th scope="col">입찰금액</th>
                            <th scope="col">상태</th>
                        </thead>
                        <tbody align="center">
                            {bidData._embedded && bidData._embedded.bids.map((bid) => (                            
                            <tr key={bid.bidId}>
                                {
                                  bid.aucId === fin_aucId
                                  ? <td scope="row">{bid.aucPostId}</td> 
                                  : null
                                }
                                {
                                  bid.aucId === fin_aucId
                                  ? <td scope="row">{bid.bidMemId}</td> 
                                  : null
                                }
                                {
                                  bid.aucId === fin_aucId
                                  ? <td scope="row">{bid.bidAmount}</td> 
                                  : null
                                }
                                {
                                  bid.aucId === fin_aucId
                                  ? ( bid.beAuctionedYN === tmpVar                                        
                                        ? ( fin_paymentReqYN === tmpVar
                                            ? <td scope="row"><button class="btn btn-danger" onClick={(e)=>{payCancelHandler(bid, e)}}>결제취소</button></td>
                                            : 
                                              ( aucProcGubun === "E"
                                                ? <td scope="row">구매완료</td> 
                                                :<td scope="row"><button class="btn btn-danger" onClick={(e)=>{paymentHandler(bid, e)}}>결제요청</button> </td> 
                                              )
                                              
                                          )                                        
                                        : ( bid.beAuctionedYN === fin_beAuctionedYnAuc
                                            ?<td scope="row"><button class="btn btn-danger" onClick={(e)=>{beAuctionedHandler(bid.bidId2, e)}}>낙찰</button></td>                                        
                                            :<td scope="row"></td>
                                        )
                                    )                                    
                                  : null
                                }

                            </tr> ))}              
                        </tbody>                          
                    </table>
                    <div align="center">                   
                    {
                      fin_beAuctionedYnAuc === "Y"
                      ?null
                      : <input type="number" name="bid_mem" value={bidMem} onChange={bidMemHandler} placeholder="ex) 05625" />
                    }
                    {
                      fin_beAuctionedYnAuc === "Y"
                      ?null
                      : <input type="number" name="biddingAmount" value={bidAmount} onChange={bidHandler} placeholder="ex) 5000" />
                    }
                    {
                      fin_beAuctionedYnAuc === "Y"
                      ? null
                      : <button class="btn btn-outline-primary" onClick={submitHandler}>입찰하기(원)</button>   
                    } 
                    {
                      aucProcGubun === "PAYMENT END"
                      ? <button class="btn btn-danger" onClick={completeHandler}>판매종료</button>   
                      : null
                    }      
                    </div>                   
                    
          </form>          
        </div>
        

    ); 
}

export default Detail;