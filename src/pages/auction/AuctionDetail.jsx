import React, {useState, useEffect, useHistory } from 'react'; 
import { Route, Link, useLocation, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import "./bootstrap/bootstrap.min.css";
import { Button } from "react-bootstrap";

const Detail = () =>{ 
  const location = useLocation();
  const navigate = useNavigate();
  
  //console.log("aucId2==>>"+location.state.aucId2);

  //let baseAucUrl = "http://localhost:8081/";
  //let baseAucUrl = "http://192.168.72.102:8081/";
  //let baseAucUrl = "http://twopro-auction.hrd-edu.cloudzcp.com/";
  let baseAucUrl = "http://auctionm2.azurewebsites.net/";
    

  const fin_aucId = location.state.aucId2;
  const fin_beAuctionedYnAuc = location.state.beAuctionedYnAuc; 
  const fin_paymentReqYN = location.state.paymentReqYN;  
  const fin_status = location.state.status;  
  const tmpVar = "Y";
  const fin_url = baseAucUrl + "auction/auctions/" + fin_aucId;
  //const fin_url = "http://192.168.72.102:8081/auction/auctions/" + fin_aucId;   
  //const fin_url = "twopro-auction.hrd-edu.cloudzcp.com/auction/auctions/" + fin_aucId;     
  console.log("fin_url   "+fin_url);

  const selectList = ["선택", 5, 4, 3, 2, 1];

  let baseUrl = "http://twopro-chat.hrd-edu.cloudzcp.com/"; //채팅
  let roomid; //채팅
  let number = Math.floor(Math.random() * 3) + 1;
  sessionStorage.setItem("id", number);
  sessionStorage.setItem("name", "게스트");
  let hostId = 3;
  let gusetId = sessionStorage.getItem("id");

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

    const [ratingScore, SetRatingScore] = useState("");
    const [Selected, setSelected] = useState("");

    const onLogout = () => {
    	// sessionStorage 에 user_id 로 저장되어있는 아이템을 삭제한다.
        sessionStorage.removeItem('userId')
        //document.location.href = '/'
        document.location.href = '/auction/logins' ;
    }



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
                SetRatingScore(response.data.ratingScore);

                //console.log("===>"+response._links);
            });
    }, []);

    useEffect(() => {
      axios
          //.get("http://localhost:8081/auction/bids")
          //.get("http://192.168.72.102:8081/auction/bids")
          //.get("twopro-auction.hrd-edu.cloudzcp.com/auction/bids")
          .get(baseAucUrl + "auction/bids")        
          .then((response) => {
              setBids(response.data);
              //console.log("===>"+auctionData);
              //console.log("===>"+response._links);
          });
  }, []);

      //판매취소
      const AuctionCancelled = (e) => {
        e.preventDefault();

        if(sessionStorage.getItem('userId') != aucSellerId) {
          alert("판매자만 취소가 가능합니다.");
          return false;
        }

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
            bidMemId: sessionStorage.getItem('userId'),
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
        
        if(body.bidAmount <= aucBidAmount){
          alert("입찰금액은 경매시작금액보다 커야합니다.");
          return false;
        }

        //document.write(year + '/' + month + '/' + date)

        //const bid_url = "http://localhost:8081/auction/bids"; 
        //const bid_url = "http://192.168.72.102:8081/auction/bids"; 
        //const bid_url = "twopro-auction.hrd-edu.cloudzcp.com/auction/bids"; 
        const bid_url = baseAucUrl + "auction/bids"; 

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
      const beAuctionedHandler = (bid, e) => {
        e.preventDefault();

        let body = {
          aucPostId: aucPostId,
          aucId: fin_aucId,
          bidId: bid.bidId2,
        };

        //const beauction_url = "http://localhost:8081/auction/beauctions"; 
        //const beauction_url = "http://192.168.72.102:8081/auction/beauctions"; 
        //const beauction_url = "twopro-auction.hrd-edu.cloudzcp.com/auction/beauctions"; 
        const beauction_url = baseAucUrl + "auction/beauctions"; 
        
        if(sessionStorage.getItem('userId') != aucSellerId) {
          alert("판매자만 낙찰이 가능합니다.");
          return false;
        }
    
        axios
        .post(beauction_url, body)
        .then(function (res) {
          //console.log("beAuction insert res=> "+JSON.stringify(res.data, null, 2));
          //window.location.reload();
          alert("낙찰되었습니다. 경매목록으로 이동합니다.");
          document.location.href = '/auction/auctions' ;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      };

      //결제요청
      const paymentHandler = (bid, e) => {
        e.preventDefault();

        if(sessionStorage.getItem('userId') != bid.bidMemId) {
          alert("구매자만 결제요청 가능합니다.");
          return false;
        }

        if (window.confirm("결제요청 하시겠습니까?\n 낙찰금액(원) : " + bid.bidAmount ))  {
         
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
              //.post("http://localhost:8081/auction/push", body)
              //.post("http://192.168.72.102:8081/auction/push", body)
              //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/push", body)
              .post(baseAucUrl + "auction/push", body)
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
                //.post("http://localhost:8081/auction/aucpayments", body)
                //.post("http://192.168.72.102:8081/auction/aucpayments", body)
                //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/aucpayments", body)
                .post(baseAucUrl + "auction/aucpayments", body)
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
        e.preventDefault();

        if(sessionStorage.getItem('userId') != bid.bidMemId) {
          alert("구매자만 결제취소 가능합니다.");
          return false;
        }

        if (window.confirm("결제취소 하시겠습니까?"))  {
          
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
              //.post("http://localhost:8081/auction/push", body)
              //.post("http://192.168.72.102:8081/auction/push", body)
              //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/push", body)
              .post(baseAucUrl + "auction/push", body)
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
                //.post("http://localhost:8081/auction/aucpayments", body)
                //.post("http://192.168.72.102:8081/auction/aucpayments", body)
                //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/aucpayments", body)
                .post(baseAucUrl + "auction/aucpayments", body)
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
        e.preventDefault();

        if (window.confirm("판매종료 하시겠습니까?" ))  {
          
          let body = {
              postGubun: "AUC",
              paymentGubun: "END",
              postId: aucPostId,
              postTitle: aucTitle,
              aucId: fin_aucId,
              seller: "05625", //임시
          };
          console.log("판매종료 body==>" + JSON.stringify(body, null, 2));
          //const payment_url = "http://localhost:8081/pament/requestPayment";     
          //const payment_url = "http://192.168.72.102:8081/pament/requestPayment";    
          //const payment_url = "twopro-payment.hrd-edu.cloudzcp.com/pament/requestPayment";    
          //const payment_url = baseAucUrl + "pament/requestPayment";       
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
                //.post("http://localhost:8081/auction/aucpayments", body)
                //.post("http://192.168.72.102:8081/auction/aucpayments", body)
                //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/aucpayments", body)
                .post(baseAucUrl + "auction/aucpayments", body)
                .then(function (res) {
                  console.log("결제장부 insert req=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

              //CQRS연동
              var today = new Date();
              var year = today.getFullYear();
              var month = ('0' + (today.getMonth() + 1)).slice(-2);
              var day = ('0' + today.getDate()).slice(-2);
              var hour = today.getHours();
              var min = today.getMinutes();
              var sec = today.getSeconds();      
              var dateCrt = year + "" + month  + "" + day + "" + hour + "" + min + "" + sec ;
              
              let body3 = {
                  sellerId: aucSellerId,
                  aucPostId: aucPostId,
                  title: aucTitle,
                  content: aucContent,
                  aucBidAmount: aucBidAmount,
                  aucStartDate: aucStartDate,
                  aucEndDate: aucEndDate,
                  aucSaleEnd: dateCrt,   //CQRS
                  aucStatus: "Auction End",   //CQRS
              };

            axios
                //.post("http://localhost:8081/auction/pushhistory", body3)
                //.post("http://192.168.72.102:8081/auction/pushhistory", body3)
                //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/pushhistory", body3)
                .post(baseAucUrl + "auction/pushhistory", body3)
                .then(function (res) {
                  console.log("판매취소 내활동(CQRS) req=> "+JSON.stringify(res.data, null, 2));
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

            //window.location.reload();
            document.location.href = '/auction/auctions' ;
        }
      };


      //평가요청
      const ratingHandler = (bid, e) => {
        e.preventDefault();

        if(Selected === ''){
          alert("점수를 선택해주세요");
          return;
        }

        if (window.confirm("평가요청 하시겠습니까? " ))  {

          let body = {
              userId: bid.bidMemId, //임시
              //postGubun: "AUCTION",
              ratingScore: Selected,
          };
          console.log("평가 요청 body==>" + JSON.stringify(body, null, 2));
          axios
              //.post("http://localhost:8081/auction/userpush", body)
              //.post("http://192.168.72.102:8081/auction/userpush", body)
              //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/userpush", body)
              .post(baseAucUrl + "auction/userpush", body)
              .then(function (res) {
                console.log("평가요청 insert req=> "+JSON.stringify(res.data, null, 2));
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })


            let body2 = {
              buyer: bid.bidMemId, //임시
              amount: bid.bidAmount,
              paymentGubun: "RATE_COMPLETED",
              postId: bid.aucPostId,
              postTitle: aucTitle,
              aucId: fin_aucId,
              seller: aucSellerId, //임시
            };
          console.log("평가요청 insert res=> "+JSON.stringify(body2, null, 2));

          axios
              //.post("http://localhost:8081/auction/aucpayments", body2)
              //.post("http://192.168.72.102:8081/auction/aucpayments", body2)
              //.post("twopro-auction.hrd-edu.cloudzcp.com/auction/aucpayments", body2)
              .post(baseAucUrl + "auction/aucpayments", body2)
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

      //채팅
      const chattingHandler = (bid, e) => {
        let body = {
          postId: 12345,
          //hostId: sessionStorage.getItem('userId'),
          //guestId: bid.bidMemId,
          hostId: hostId,
          guestId: number,
        };

        console.log("채팅 insert res=> "+JSON.stringify(body, null, 2));
    
        axios
          .post(baseUrl + "chat/room", body)
          .then((res) => {
            roomid = res.data.roomId;
          })
          .then(() => {
            navigate("/chatting/room/" + roomid);
          });
      }

      function showChattingList() {
        navigate("/chatting/list/" + hostId);
      }


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

      const handleSelect = (e) => {
        setSelected(e.target.value);
      };
    
      
    return ( 
        <div class="container" > 
          <form>
          <p></p>
          <h4 class="card-title">경매상세 ({sessionStorage.getItem('userId')}  {fin_status})</h4>
            <div class="form-group">
                <label class="col-sm-3 control-label" >Seller ID</label>
                <div class="col-sm-5"><input type="number" id="sellerId" disabled="true" class="form-control" placeholder="ex) 1111" value={aucSellerId} onChange={sellerIdHandler}  aria-label="Seller ID" aria-describedby="basic-addon1"></input></div>
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
            <button class="btn btn-outline-primary" type='button' onClick={onLogout}>Logout</button>
          </div>        
           </form >
              <form >
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
                                              ( aucProcGubun === "RE"
                                                ? <td scope="row">평가완료 </td> 
                                                :
                                                  (aucProcGubun === "E"
                                                    ? <td>
                                                        구매완료 &nbsp; &nbsp; &nbsp;
                                                        <select onChange={handleSelect} value={Selected}>
                                                          {selectList.map((item) => (
                                                            <option value={item} key={item}>
                                                              {item}
                                                            </option>
                                                          ))}
                                                        </select>                                                
                                                        <button class="btn btn-outline-primary" onClick={(e)=>{ratingHandler(bid, e)}}>평가하기</button> 
                                                     </td>
                                                    : <td scope="row"><button class="btn btn-danger" onClick={(e)=>{paymentHandler(bid, e)}}>결제요청</button> 
                                                        {bid.bidMemId != sessionStorage.getItem('userId') ? (
                                                          <Button variant="outline-primary" onClick={(e)=>{chattingHandler(bid, e)}}>
                                                          채팅하기
                                                          </Button>
                                                        ) : (
                                                          <Button variant="outline-primary" onClick={showChattingList}>
                                                          채팅리스트보기
                                                          </Button>
                                                        )}
                                                    
                                                    </td> 
                                                  )
                                              )
                                              
                                          )                                        
                                        : ( bid.beAuctionedYN === fin_beAuctionedYnAuc
                                            ?<td scope="row"><button class="btn btn-danger" onClick={(e)=>{beAuctionedHandler(bid, e)}}>낙찰</button></td>                                        
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
                      : <input type="hidden" name="bid_mem" value={sessionStorage.getItem('userId')} onChange={bidMemHandler} placeholder="ex) 05625" />
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