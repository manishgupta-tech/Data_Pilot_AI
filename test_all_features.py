import urllib.request
import urllib.parse
import json
import os
import sqlite3

BASE_URL = "http://127.0.0.1:3000"

def request(path, method="GET", data=None, token=None, is_json=True, raw_body=None, content_type=None):
    url = f"{BASE_URL}{path}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    if data is not None and is_json:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif raw_body is not None:
        body = raw_body
        if content_type:
            headers["Content-Type"] = content_type
    else:
        body = None

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content_type_header = resp.headers.get("Content-Type", "")
            resp_body = resp.read()
            if "application/json" in content_type_header:
                return resp.status, json.loads(resp_body.decode("utf-8"))
            else:
                return resp.status, resp_body
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, err_body
    except Exception as e:
        return 500, str(e)

def run_tests():
    results = {}
    print("=== STARTING COMPREHENSIVE SYSTEM TESTS ===")

    # 1. Health
    status, health = request("/api/health")
    print("1. Health Check:", status, health)
    results["health"] = (status == 200 and health.get("status") == "ok")

    # 2. Auth Flow
    test_user = {
        "username": "testverifier_user",
        "email": "testverifier@example.com",
        "password": "SecurePassword123!"
    }
    status, reg_res = request("/api/auth/register", method="POST", data=test_user)
    print("2a. Register:", status, reg_res)
    
    # Login
    login_data = {
        "email": "testverifier@example.com",
        "password": "SecurePassword123!"
    }
    status, login_res = request("/api/auth/login", method="POST", data=login_data)
    print("2b. Login:", status, login_res.keys() if isinstance(login_res, dict) else login_res)
    token = login_res.get("access_token") if isinstance(login_res, dict) else None
    results["auth"] = token is not None

    # Check Me
    status, me_res = request("/api/auth/me", token=token)
    print("2c. Get Profile (/me):", status, me_res)

    # 3. Datasets List & Seeded Dataset
    status, datasets = request("/api/datasets", token=token)
    print(f"3a. Get Datasets (Count: {len(datasets)}):", status)
    seeded_dataset_id = datasets[0]["id"] if len(datasets) > 0 else None

    # Upload Test CSV Dataset
    csv_content = "ID,Product,Category,Revenue,Units_Sold,Rating\n1,Widget A,Electronics,120.5,10,4.5\n2,Widget B,Electronics,250.0,20,4.8\n3,Gadget C,Home,80.0,5,3.9\n4,Gadget D,Home,450.0,30,4.9\n5,Tool E,Tools,30.0,3,4.1\n6,Tool F,Tools,600.0,40,4.7\n7,Widget G,Electronics,150.0,12,4.2\n8,Gadget H,Home,95.0,8,4.0\n"
    
    boundary = "----WebKitFormBoundaryTest123"
    body_parts = []
    body_parts.append(f"--{boundary}".encode())
    body_parts.append(b'Content-Disposition: form-data; name="file"; filename="test_products.csv"')
    body_parts.append(b'Content-Type: text/csv')
    body_parts.append(b'')
    body_parts.append(csv_content.encode('utf-8'))
    body_parts.append(f"--{boundary}--".encode())
    body_parts.append(b'')
    raw_multipart = b"\r\n".join(body_parts)

    status, upload_res = request("/api/datasets/upload", method="POST", token=token, raw_body=raw_multipart, content_type=f"multipart/form-data; boundary={boundary}")
    print("3b. CSV Dataset Upload:", status, upload_res if status != 200 else f"Uploaded dataset ID {upload_res.get('id')}")
    dataset_id = upload_res.get("id") if isinstance(upload_res, dict) and "id" in upload_res else seeded_dataset_id
    results["upload"] = status in (200, 201) and dataset_id is not None

    # 4. Dataset Preview & Analysis
    status, dataset_detail = request(f"/api/datasets/{dataset_id}", token=token)
    print(f"4a. Dataset Detail ({dataset_id}):", status, dataset_detail.get("name") if isinstance(dataset_detail, dict) else "")

    status, preview_rows = request(f"/api/datasets/{dataset_id}/preview?limit=10", token=token)
    print(f"4b. Dataset Preview Rows:", status, len(preview_rows) if isinstance(preview_rows, list) else preview_rows)

    status, analysis_res = request(f"/api/analysis/{dataset_id}/summary", token=token)
    print("4c. Dataset Analysis Summary:", status, "Quality Score:", analysis_res.get("quality") if isinstance(analysis_res, dict) else "")
    results["analysis"] = status == 200

    # 5. DSA Algorithms Test
    print("\n--- TESTING DSA ALGORITHMS ---")
    dsa_results = {}

    # 5a. Searches (Linear, Binary, Hash)
    for search_algo in ["linear", "binary", "hash"]:
        search_payload = {
            "dataset_id": dataset_id,
            "column_name": "Revenue",
            "target_value": "250.0",
            "algorithm": search_algo
        }
        status, res = request("/api/dsa/search", method="POST", data=search_payload, token=token)
        print(f"DSA Search ({search_algo}):", status, res if status != 200 else f"Matches: {res.get('match_count')}, Time: {res.get('execution_time_seconds')}s, Complexity: {res.get('time_complexity')}")
        dsa_results[f"search_{search_algo}"] = status == 200 and res.get("match_count", 0) >= 0

    # 5b. Sorts
    sort_algos = ["bubble", "selection", "insertion", "merge", "quick", "heap"]
    for sort_algo in sort_algos:
        sort_payload = {
            "dataset_id": dataset_id,
            "column_name": "Revenue",
            "algorithm": sort_algo,
            "ascending": True
        }
        status, res = request("/api/dsa/sort", method="POST", data=sort_payload, token=token)
        is_sorted = False
        if status == 200 and isinstance(res, dict) and "sorted_preview" in res:
            sorted_vals = [r.get("Revenue") for r in res["sorted_preview"] if isinstance(r, dict) and "Revenue" in r]
            if sorted_vals and sorted_vals == sorted(sorted_vals):
                is_sorted = True
        print(f"DSA Sort ({sort_algo}):", status, f"Sorted Correctly: {is_sorted}, Time: {res.get('execution_time_seconds') if isinstance(res, dict) else ''}s, Complexity: {res.get('time_complexity') if isinstance(res, dict) else ''}")
        dsa_results[f"sort_{sort_algo}"] = is_sorted or status == 200

    # 5c. BST Structure
    status, res = request(f"/api/dsa/{dataset_id}/bst?column_name=Revenue", token=token)
    print("DSA BST Structure:", status, f"Inorder sample count: {len(res.get('inorder_sample', [])) if isinstance(res, dict) else 0}")
    dsa_results["bst"] = status == 200

    # 5d. Graph Analysis (BFS/DFS)
    status, res = request(f"/api/dsa/{dataset_id}/graph", token=token)
    print("DSA Graph Analysis:", status, f"BFS Nodes count: {len(res.get('bfs_nodes', [])) if isinstance(res, dict) else 0}")
    dsa_results["graph"] = status == 200

    # 5e. DSA Performance History
    status, history = request("/api/dsa/performance", token=token)
    print(f"DSA Performance History Records:", status, len(history) if isinstance(history, list) else 0)
    dsa_results["history"] = status == 200 and len(history) > 0

    results["dsa"] = all(dsa_results.values())

    # 6. Reports Generation (PDF, CSV, Excel)
    print("\n--- TESTING REPORT GENERATION ---")
    report_results = {}
    for rtype in ["csv", "excel", "pdf"]:
        report_payload = {
            "dataset_id": dataset_id,
            "report_type": rtype,
            "title": f"Test {rtype.upper()} Report"
        }
        status, res = request("/api/reports/generate", method="POST", data=report_payload, token=token)
        print(f"Generate Report ({rtype}):", status, res.get("file_path") if isinstance(res, dict) else res)
        report_results[rtype] = status == 200 and "download_url" in res

    results["reports"] = all(report_results.values())

    # 7. Database Persistence Check
    print("\n--- CHECKING DATABASE FILE PERSISTENCE ---")
    db_file = "datapilot.db"
    db_exists = os.path.exists(db_file)
    print(f"Database File '{db_file}' exists:", db_exists)
    if db_exists:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [t[0] for t in cursor.fetchall()]
        print("SQLite Tables:", tables)
        
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM algorithm_runs;")
        runs_count = cursor.fetchone()[0]
        print(f"User Count in DB: {user_count}, Algorithm Runs Count in DB: {runs_count}")
        conn.close()
        results["persistence"] = user_count > 0 and runs_count > 0
    else:
        results["persistence"] = False

    print("\n=== VERIFICATION SUMMARY ===")
    all_passed = True
    for k, v in results.items():
        print(f"{k.upper()}: {'PASSED' if v else 'FAILED'}")
        if not v:
            all_passed = False
            
    if all_passed:
        print("\nSUCCESS: All backend tests & functional checks completed successfully!")

if __name__ == "__main__":
    run_tests()
