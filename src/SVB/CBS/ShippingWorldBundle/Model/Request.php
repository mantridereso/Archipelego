<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 14:39
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Request
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="BusinessAction,Request")
 */
class Request implements RequestInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var ServiceInterface
     *
     * @OGM\ManyToOne(relation="of_service")
     */
    private $serviceRequested;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return TransportInterface
     *
     */
    public function getServiceRequested()
    {
        return $this->serviceReferred;
    }

    /**
     * @param int $id
     * @return Request
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param ServiceInterface $serviceRequested
     * @return Request
     */
    public function setServiceRequested($serviceRequested)
    {
        $this->serviceRequested = $serviceRequested;
        return $this;
    }

    /**
     * @return Request
     */
    public static function create(){
        return new Request();
    }

}