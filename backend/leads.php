<?php
// ------------------- Leads Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$admin = requireAdminAuth($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $conditions = ["1=1"];
        $params = [];
        $types = "";

        if (!empty($_GET['status']) && $_GET['status'] !== 'All') {
            $conditions[] = "`status` = ?";
            $params[] = trim($_GET['status']);
            $types .= "s";
        }

        if (!empty($_GET['search'])) {
            $search = "%" . trim($_GET['search']) . "%";
            $conditions[] = "(`name` LIKE ? OR `phone` LIKE ? OR `email` LIKE ? OR `interest` LIKE ? OR `location` LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $types .= "sssss";
        }

        $whereSql = implode(" AND ", $conditions);
        $sql = "SELECT * FROM `quick_enquiries` WHERE $whereSql ORDER BY `id` DESC";
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $res = $stmt->get_result();

        $leads = [];
        while ($row = $res->fetch_assoc()) {
            $leads[] = [
                "id"            => (int)$row['id'],
                "name"          => $row['name'],
                "phone"         => $row['phone'],
                "email"         => $row['email'] ?? '',
                "interest"      => $row['interest'] ?? '',
                "budget"        => $row['budget'] ?? '',
                "location"      => $row['location'] ?? '',
                "message"       => $row['message'] ?? '',
                "propertyId"    => !empty($row['property_id']) ? (int)$row['property_id'] : null,
                "propertyTitle" => $row['property_title'] ?? '',
                "status"        => $row['status'] ?? 'New',
                "adminNotes"    => $row['admin_notes'] ?? '',
                "createdAt"     => $row['created_at']
            ];
        }
        $stmt->close();

        // Also fetch status counts
        $countsRes = $conn->query("SELECT `status`, COUNT(*) as cnt FROM `quick_enquiries` GROUP BY `status`");
        $statusCounts = ['Total' => count($leads), 'New' => 0, 'Contacted' => 0, 'Site Visit Scheduled' => 0, 'Closed' => 0];
        if ($countsRes) {
            $totalAll = 0;
            while ($cRow = $countsRes->fetch_assoc()) {
                $st = $cRow['status'] ?: 'New';
                $cnt = (int)$cRow['cnt'];
                $statusCounts[$st] = $cnt;
                $totalAll += $cnt;
            }
            $statusCounts['Total'] = $totalAll;
        }

        echo json_encode([
            "success"      => true,
            "count"        => count($leads),
            "statusCounts" => $statusCounts,
            "leads"        => $leads
        ]);
        exit;

    case 'PUT':
        if (empty($leadId)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Lead ID is required"]);
            exit;
        }

        $input = getJsonInput();
        $status = !empty($input['status']) ? trim($input['status']) : 'New';
        $adminNotes = isset($input['adminNotes']) ? trim($input['adminNotes']) : '';

        $stmt = $conn->prepare("UPDATE `quick_enquiries` SET `status` = ?, `admin_notes` = ? WHERE `id` = ?");
        $stmt->bind_param("ssi", $status, $adminNotes, $leadId);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to update lead: " . $stmt->error]);
            $stmt->close();
            exit;
        }
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Lead status updated"]);
        exit;

    case 'DELETE':
        if (empty($leadId)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Lead ID is required"]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM `quick_enquiries` WHERE `id` = ?");
        $stmt->bind_param("i", $leadId);
        $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Lead deleted successfully"]);
        exit;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Method not allowed"]);
        exit;
}
