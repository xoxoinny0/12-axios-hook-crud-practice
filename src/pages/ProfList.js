import React, { memo, useState, useCallback, useEffect} from 'react';
import useAxios from 'axios-hooks';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';

import Spinner from '../components/Spinner';
import Table from '../components/Table';

const LinkContainer = styled.div`
    position: sticky;
    top: 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
`;

const TopLink = styled(NavLink)`
    margin-right: 15px;
    display: inline-block;
    font-size: 16px;
    padding: 7px 10px 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
    text-decoration: none;

    &:hover {
        background-color: #06f2;
    }
`;

const ProfList = memo(() => {
    /** 화면에 표시할 교수 데이터를 저장하기 위한 상태 변수 */
    const [prof, setProf] = useState([]);

    /** 백엔드로부터 데이터 불러오기 */
    const [{data, loading : loading1, error}, refetch] = useAxios('/professor', {
        useCache : false
    });

    /** ajax 로딩이 완료되었을 때 실행될 hook */
    useEffect( () => {
        // ajax의 결과를 화면에 표시하기 위한 상태값에 복사한다.
        setProf(data);
    }, [data]);

     /** 백엔드로부터 데이터 삭제하기 */
    const [{loading: loading2}, sendDelete] = useAxios({
        method: 'DELETE'
    }, {
        useCache : false,
        manual: true
    });

     /** 삭제 버튼 클릭 시 호출될 이벤트 핸들러 */
     const onDeleteClick = useCallback( (e) => {
        e.preventDefault();

        // 이벤트가 발생한 대상을 가져옴 --> 삭제하기 링크
        const current = e.target;

        // 클릭된 링크에 숨겨져 있는 일련번호와 학생이름 가져오기
        const id = parseInt(current.dataset.id);
        const name = current.dataset.name;

        // 삭제 확인
        if (window.confirm(`정말 ${name}교수의 정보를 삭제하시겠습니까?`)) {
            (async () => {
                try {
                  await sendDelete({ url: `/professor/${id}`})
                } catch (e) {
                    console.error(e);
                    window.alert(`[${e.response.status}] ${e.response.statusText}\n${e.message}`)
                }
              
                setProf(currentData => {
                    return currentData.filter((v,i) => v.id !== id);
                });
            })();
        }
    }, [sendDelete]);


  return (
    <div>
    <Spinner loading={loading1 || loading2}/>

    <LinkContainer>
        <TopLink to="add">교수 등록하기</TopLink>
    </LinkContainer>

    { error ? (
        <div>
            <h1>Oops~~!! {error.code} Error.</h1>
            <hr />
            <p>{error.message}</p>
        </div>
    ) : (
        <Table>
            <thead>
                <tr>
                    <th rowSpan='2'>No.</th>
                    <th rowSpan='2'>이름</th>
                    <th rowSpan='2'>아이디</th>
                    <th rowSpan='2'>직급</th>
                    <th rowSpan='2'>급여</th>
                    <th rowSpan='2'>입사일</th>
                    <th rowSpan='2'>보직수당</th>
                    <th rowSpan='2'>소속학과번호</th>
                    <th rowSpan='2'>수정</th>
                    <th rowSpan='2'>삭제</th>
                </tr>
            </thead>
            <tbody>
                { prof && prof.map(({ id, name, userid, position, sal, hiredate, comm, deptno}, i) => {
                    return (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{name}</td>
                            <td>{userid}</td>
                            <td>{position}</td>
                            <td>{sal}만원</td>
                            <td>{dayjs(hiredate).format('YYYY-MM-DD')}</td>
                            <td>{comm && `${comm}만원`}</td>
                            <td>{deptno}</td>
                            <td>
                                {/* 수정할 대상을 의미하는 id값을 'edit'라는 URL을 갖는 페이지에 path파라미터로 전달 */}
                                <NavLink to={`edit/${id}`}>수정하기</NavLink>
                            </td>
                            <td>
                                <a href="#!" data-id={id} data-name={name} onClick={onDeleteClick}>삭제하기</a>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    )}
</div>
  )
})

export default ProfList;